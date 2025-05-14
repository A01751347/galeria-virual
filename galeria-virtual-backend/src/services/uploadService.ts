import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { s3, BUCKET } from "../config/s3";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { logger } from '../utils/logger';

// Constantes
const UPLOAD_BASE_DIR = path.join(__dirname, '../../public/uploads');
const S3_BASE_URL = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

// Asegurar que existan los directorios locales (para fallback)
export const createUploadDirs = (): void => {
  const dirs = [
    path.join(UPLOAD_BASE_DIR, 'obras'),
    path.join(UPLOAD_BASE_DIR, 'artistas'),
    path.join(UPLOAD_BASE_DIR, 'qr')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Directorio local creado: ${dir}`);
    }
  });
};

/**
 * Sube un archivo a S3
 * @param buffer Buffer de datos del archivo
 * @param key Ruta y nombre del archivo en S3
 * @param contentType Tipo MIME del archivo
 */
const uploadToS3 = async (buffer: Buffer, key: string, contentType: string) => {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read"
    }));
    
    return `${S3_BASE_URL}/${key}`;
  } catch (err) {
    logger.error("Error al subir archivo a S3:", err);
    throw err;
  }
};

/**
 * Procesa una imagen y la sube a S3
 * @param filePath Ruta del archivo local a procesar
 * @param options Opciones de procesamiento
 */
export const processImage = async (
  filePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "jpeg" | "png" | "webp";
    folder?: string;
  } = {}
): Promise<string> => {
  const { width, height, quality = 80, format = "webp", folder = "misc" } = options;
  const parsed = path.parse(filePath);
  const filename = `${parsed.name}-${Date.now()}.${format}`;
  const key = `uploads/${folder}/${filename}`;

  try {
    let img = sharp(filePath);
    
    if (width || height) {
      img = img.resize({ width, height, fit: "inside", withoutEnlargement: true });
    }
    
    img = format === "jpeg"
      ? img.jpeg({ quality })
      : format === "png"
        ? img.png({ quality })
        : img.webp({ quality });

    const buffer = await img.toBuffer();
    const url = await uploadToS3(buffer, key, `image/${format}`);
    
    // Eliminar el archivo local original una vez subido a S3
    fs.unlinkSync(filePath);

    return url;
  } catch (err) {
    logger.error("Error procesando imagen:", err);
    throw err;
  }
};

/**
 * Sube un archivo directamente a S3 desde un Buffer
 * @param buffer Buffer del archivo
 * @param filename Nombre del archivo
 * @param folder Carpeta donde guardar el archivo
 * @param contentType Tipo MIME del archivo
 */
export const uploadBufferToS3 = async (
  buffer: Buffer,
  filename: string,
  folder: string = 'misc',
  contentType: string = 'application/octet-stream'
): Promise<string> => {
  const key = `uploads/${folder}/${filename}`;
  
  try {
    return await uploadToS3(buffer, key, contentType);
  } catch (err) {
    logger.error(`Error al subir buffer a S3 (${filename}):`, err);
    throw err;
  }
};

/**
 * Procesa un archivo de multer y lo sube a S3
 * @param file Archivo de multer
 * @param folder Carpeta destino (obras, artistas, etc.)
 */
export const processUploadedFile = async (
  file: Express.Multer.File,
  folder: string = 'misc'
): Promise<string> => {
  if (!file) {
    throw new Error('Archivo no proporcionado');
  }
  
  // Determinamos el formato basado en mimetype
  let format: "jpeg" | "png" | "webp" = "webp";
  
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    format = "jpeg";
  } else if (file.mimetype === 'image/png') {
    format = "png";
  }
  
  return processImage(file.path, {
    format,
    folder,
    quality: 85
  });
};

/**
 * Elimina un archivo de S3
 * @param url URL completa del archivo en S3
 */
export const deleteFile = async (url: string): Promise<boolean> => {
  if (!url.includes(S3_BASE_URL)) {
    logger.warn(`La URL no pertenece a S3: ${url}`);
    return false;
  }
  
  try {
    const key = url.replace(`${S3_BASE_URL}/`, "");
    
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key
    }));
    
    logger.info(`Archivo eliminado de S3: ${key}`);
    return true;
  } catch (err) {
    logger.error(`Error eliminando archivo de S3: ${url}`, err);
    return false;
  }
};

/**
 * Genera variaciones de una imagen (thumbnail, medium, large)
 * @param localPath Ruta local del archivo
 * @param folder Carpeta destino
 * @param filename Nombre base del archivo
 */
export const generateImageVariations = async (
  localPath: string,
  folder: string,
  filename: string
): Promise<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}> => {
  const variants = [
    { suffix: "_thumbnail", resize: { width: 150, height: 150 }, quality: 80 },
    { suffix: "_medium", resize: { width: 800, height: 800 }, quality: 85 },
    { suffix: "_large", resize: { width: 1920, height: 1920 }, quality: 85 },
    { suffix: "_original", resize: {}, quality: 90 }
  ];

  const urls: Record<string, string> = {};
  
  for (const v of variants) {
    let proc = sharp(localPath);
    
    if (v.resize.width || v.resize.height) {
      proc = proc.resize({
        ...v.resize,
        fit: "inside",
        withoutEnlargement: true
      });
    }
    
    proc = proc.webp({ quality: v.quality });
    
    const buffer = await proc.toBuffer();
    const key = `uploads/${folder}/${filename}${v.suffix}.webp`;
    
    urls[v.suffix.replace("_", "")] = await uploadToS3(buffer, key, "image/webp");
  }
  
  // Eliminar archivo local
  fs.unlinkSync(localPath);
  
  return urls as {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
};
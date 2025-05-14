import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { s3, BUCKET } from "../config/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from '../utils/logger';

const UPLOAD_BASE_DIR = path.join(__dirname, '../../public/uploads');

// Asegurar que existan los directorios
export const createUploadDirs = (): void => {
  const dirs = [
    path.join(UPLOAD_BASE_DIR, 'obras'),
    path.join(UPLOAD_BASE_DIR, 'artistas'),
    path.join(UPLOAD_BASE_DIR, 'qr')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Directorio creado: ${dir}`);
    }
  });
};

/**
 * Procesar imagen optimizándola para web
 * @param filePath Ruta del archivo a procesar
 * @param options Opciones de procesamiento
 */

export const processImage = async (
  filePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "jpeg" | "png" | "webp";
  } = {}
): Promise<string> => {
  const { width, height, quality = 80, format = "webp" } = options;
  const parsed = path.parse(filePath);
  const key = `uploads/${parsed.dir.split("uploads/").pop() || ""}/${parsed.name}.${format}`;

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

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: `image/${format}`,
      ACL: "public-read"
    }));

    // Opcional: borra el archivo local original
    fs.unlinkSync(filePath);

    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    logger.error("Error procesando y subiendo imagen:", err);
    throw err;
  }
};

/**
 * Eliminar archivo del sistema
 * @param filePath Ruta relativa del archivo a eliminar
 */
export const deleteFile = async (key: string): Promise<boolean> => {
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key.replace(`https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`, "")
    }));
    logger.info(`Eliminado de S3: ${key}`);
    return true;
  } catch (err) {
    logger.error(`Error eliminando ${key}:`, err);
    return false;
  }
};

export const processMultipleImages = async (
  filePaths: string[],
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<string[]> => {
  const promises = filePaths.map(filePath => processImage(filePath, options));
  return Promise.all(promises);
};

/**
 * Generate image variations (thumbnail, medium, large)
 */
const uploadBuf = async (buffer: Buffer, key: string, contentType: string) =>
  s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read"
  }));

export const generateImageVariations = async (
  localPath: string,
  baseName: string
) => {
  const variants = [
    { suffix: "_thumbnail.webp", resize: { width: 150, height: 150 } },
    { suffix: "_medium.webp",   resize: { width: 800,  height: 800 } },
    { suffix: "_large.webp",    resize: { width: 1920, height: 1920, quality: 85 } },
    { suffix: "_original.webp", resize: {}, quality: 90 }
  ];

  const urls: Record<string,string> = {};
  for (const v of variants) {
    let proc = sharp(localPath);
    if (v.resize.width || v.resize.height) {
      proc = proc.resize({ ...v.resize, fit: "inside", withoutEnlargement: true });
    }
    proc = proc.webp({ quality: v.quality ?? 80 });
    const buf = await proc.toBuffer();
    const key = `uploads/${baseName}${v.suffix}`;
    await uploadBuf(buf, key, "image/webp");
    urls[v.suffix.replace(".webp","")] = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
  // borra local si quieres...
  return urls as {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
};

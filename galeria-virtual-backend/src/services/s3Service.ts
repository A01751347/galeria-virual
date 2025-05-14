// src/services/s3Service.ts
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { s3, BUCKET } from '../config/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../utils/logger';

/**
 * Procesa una imagen y la sube a S3
 * @param filePath Ruta del archivo a procesar
 * @param folder Carpeta de destino en S3 (obras, artistas, etc.)
 * @returns URL del archivo en S3
 */
export const processImageAndUploadToS3 = async (
  filePath: string,
  folder: string = 'misc'
): Promise<string> => {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(fileName).toLowerCase();
  const timestamp = Date.now();
  const uniqueName = `${path.basename(fileName, fileExt)}-${timestamp}`;
  
  // Determinar formato de salida
  let outputFormat: 'jpeg' | 'png' | 'webp' = 'webp';
  if (fileExt === '.jpg' || fileExt === '.jpeg') {
    outputFormat = 'jpeg';
  } else if (fileExt === '.png') {
    outputFormat = 'png';
  }
  
  try {
    // Procesar la imagen con sharp
    const processedImageBuffer = await sharp(filePath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      [outputFormat]({ quality: 85 })
      .toBuffer();
    
    // Definir la ruta en S3
    const s3Key = `uploads/${folder}/${uniqueName}.${outputFormat}`;
    
    // Subir a S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: processedImageBuffer,
      ContentType: `image/${outputFormat}`,
    }));
    
    // Generar URL
    const s3Url = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    
    // Eliminar archivo local temporal
    fs.unlinkSync(filePath);
    
    logger.info(`Imagen subida a S3: ${s3Url}`);
    return s3Url;
  } catch (error) {
    logger.error(`Error al procesar y subir imagen a S3:`, error);
    // Si ocurre un error, intentar eliminar el archivo temporal
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      logger.error(`Error al eliminar archivo temporal:`, e);
    }
    throw error;
  }
};

/**
 * Procesa un archivo multer y lo sube a S3
 * @param file Archivo multer
 * @param folder Carpeta destino en S3
 * @returns URL del archivo en S3
 */
export const processUploadedFileToS3 = async (
  file: Express.Multer.File,
  folder: string = 'misc'
): Promise<string> => {
  if (!file) {
    throw new Error('Archivo no proporcionado');
  }
  
  return processImageAndUploadToS3(file.path, folder);
};
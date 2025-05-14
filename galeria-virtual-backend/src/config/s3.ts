// src/config/s3.ts
import { S3Client } from "@aws-sdk/client-s3";
import { logger } from '../utils/logger';

// Verificar que las variables de entorno estén configuradas
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  logger.warn('Configuración S3 incompleta. Verifica tus variables de entorno:');
  logger.warn(`AWS_REGION: ${region ? 'OK' : 'FALTA'}`);
  logger.warn(`AWS_ACCESS_KEY_ID: ${accessKeyId ? 'OK' : 'FALTA'}`);
  logger.warn(`AWS_SECRET_ACCESS_KEY: ${secretAccessKey ? 'OK' : 'FALTA'}`);
  logger.warn(`S3_BUCKET: ${bucketName ? 'OK' : 'FALTA'}`);
}

// Crear el cliente de S3
export const s3 = new S3Client({
  region: region || 'us-east-2',
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || ''
  }
});

export const BUCKET = bucketName || 'artwork-bucket-53';
// src/middleware/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Directorio temporal para subidas
const TEMP_UPLOAD_DIR = path.join(__dirname, '../../temp');

// Asegurar que el directorio temporal existe
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

// Configuración para almacenamiento temporal
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtro para imágenes
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo se permiten JPEG, PNG, GIF y WebP.'));
  }
};

// Límite de tamaño (5MB por defecto)
const limits = {
  fileSize: parseInt(process.env.FILE_UPLOAD_SIZE_LIMIT || '5000000', 10)
};

// Middleware para subida de archivos
export const uploadObra = multer({ storage: tempStorage, fileFilter, limits });
export const uploadArtista = multer({ storage: tempStorage, fileFilter, limits });
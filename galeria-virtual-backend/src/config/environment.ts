// src/config/environment.ts
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Entorno de la aplicación
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Puerto del servidor
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Base de datos
export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'usuario_galeria',
  password: process.env.DB_PASS || 'password_segura',
  database: process.env.DB_NAME || 'galeria_virtual',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
};

// Configuración JWT
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'jdoiandhjnakcnahcbnkeoncnis',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

// Email
export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
  secure: process.env.EMAIL_PORT === '465',
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || 'Galería Virtual <noreply@galeriavirtual.com>'
};

// URLs
export const URL_CONFIG = {
  frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  backend: process.env.BACKEND_URL || 'http://localhost:3000'
};

// Configuración de archivos
export const FILE_CONFIG = {
  uploadPath: process.env.FILE_UPLOAD_PATH || './public/uploads',
  sizeLimit: process.env.FILE_UPLOAD_SIZE_LIMIT 
    ? parseInt(process.env.FILE_UPLOAD_SIZE_LIMIT, 10) 
    : 5000000 // 5MB por defecto
};

// Rutas de archivos
export const PATHS = {
  root: path.resolve(__dirname, '../../'),
  public: path.resolve(__dirname, '../../public'),
  uploads: path.resolve(__dirname, '../../public/uploads')
};
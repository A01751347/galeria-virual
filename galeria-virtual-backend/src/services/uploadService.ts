import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
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
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<string> => {
  try {
    const { 
      width, 
      height, 
      quality = 80, 
      format = 'webp' 
    } = options;
    
    // Definir output path
    const parsedPath = path.parse(filePath);
    const outputFilename = `${parsedPath.name}.${format}`;
    const outputPath = path.join(parsedPath.dir, outputFilename);
    
    // Procesar con sharp
    let sharpInstance = sharp(filePath);
    
    // Resize si se especificaron dimensiones
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Establecer formato y calidad
    if (format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality });
    } else {
      sharpInstance = sharpInstance.webp({ quality });
    }
    
    // Guardar imagen procesada
    await sharpInstance.toFile(outputPath);
    
    // Eliminar archivo original si es diferente
    if (filePath !== outputPath) {
      fs.unlinkSync(filePath);
    }
    
    // Devolver ruta relativa para guardar en BD
    const relativePath = outputPath.replace(path.join(__dirname, '../../public'), '');
    return relativePath;
  } catch (error) {
    logger.error('Error al procesar imagen:', error);
    throw error;
  }
};

/**
 * Eliminar archivo del sistema
 * @param filePath Ruta relativa del archivo a eliminar
 */
export const deleteFile = (filePath: string): boolean => {
  try {
    // Convertir ruta relativa a absoluta
    const fullPath = path.join(__dirname, '../../public', filePath);
    
    // Verificar si existe el archivo
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`Archivo eliminado: ${fullPath}`);
      return true;
    }
    
    logger.warn(`Archivo no encontrado para eliminar: ${fullPath}`);
    return false;
  } catch (error) {
    logger.error(`Error al eliminar archivo ${filePath}:`, error);
    return false;
  }
};
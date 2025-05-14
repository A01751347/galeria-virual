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
export const generateImageVariations = async (
  originalPath: string,
  baseName: string,
  outputDir: string
): Promise<{
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}> => {
  const ext = path.extname(originalPath);
  const fileName = path.basename(originalPath, ext);
  
  const thumbnailPath = path.join(outputDir, `${baseName}_thumbnail.webp`);
  const mediumPath = path.join(outputDir, `${baseName}_medium.webp`);
  const largePath = path.join(outputDir, `${baseName}_large.webp`);
  const optimizedOriginalPath = path.join(outputDir, `${baseName}_original.webp`);
  
  await Promise.all([
    sharp(originalPath)
      .resize(150, 150, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(thumbnailPath),
      
    sharp(originalPath)
      .resize(800, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(mediumPath),
      
    sharp(originalPath)
      .resize(1920, 1920, { fit: 'inside' })
      .webp({ quality: 85 })
      .toFile(largePath),
      
    sharp(originalPath)
      .webp({ quality: 90 })
      .toFile(optimizedOriginalPath)
  ]);
  
  return {
    thumbnail: `/uploads/${path.basename(thumbnailPath)}`,
    medium: `/uploads/${path.basename(mediumPath)}`,
    large: `/uploads/${path.basename(largePath)}`,
    original: `/uploads/${path.basename(optimizedOriginalPath)}`
  };
};

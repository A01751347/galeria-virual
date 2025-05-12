import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

const QR_SAVE_PATH = path.join(__dirname, '../../public/uploads/qr');

// Asegurar que el directorio existe
if (!fs.existsSync(QR_SAVE_PATH)) {
  fs.mkdirSync(QR_SAVE_PATH, { recursive: true });
}

/**
 * Genera un código QR para una obra
 * @param codigo Código único de la obra
 * @param obraId ID de la obra
 * @returns URL del código QR generado
 */
export const generarQR = async (codigo: string, obraId: number): Promise<string> => {
  try {
    // URL a la que apuntará el QR (página de detalle de la obra)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrContent = `${frontendUrl}/obra/${codigo}`;
    
    // Nombre del archivo
    const qrFileName = `obra_${obraId}_${Date.now()}.png`;
    const qrFilePath = path.join(QR_SAVE_PATH, qrFileName);
    
    // Generar y guardar el código QR
    await QRCode.toFile(qrFilePath, qrContent, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Devolver la URL relativa del código QR
    return `/uploads/qr/${qrFileName}`;
  } catch (error) {
    logger.error('Error al generar el código QR:', error);
    throw new Error('No se pudo generar el código QR');
  }
};
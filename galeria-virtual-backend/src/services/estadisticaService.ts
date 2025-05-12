import db from '../config/database';
import { Estadisticas } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener estadísticas generales
export const getEstadisticas = async (): Promise<Estadisticas> => {
  try {
    const resultado = await db.procedure<Estadisticas[]>('sp_obtener_estadisticas', []);
    
    return resultado[0];
  } catch (error) {
    logger.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
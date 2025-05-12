import { Request, Response, NextFunction } from 'express';
import * as estadisticaService from '../services/estadisticaService';

// Obtener estadísticas generales (admin)
export const getEstadisticas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const estadisticas = await estadisticaService.getEstadisticas();
    res.json({ success: true, data: estadisticas });
  } catch (error) {
    next(error);
  }
};
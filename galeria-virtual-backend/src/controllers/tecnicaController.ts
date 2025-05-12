import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as tecnicaService from '../services/tecnicaService';
import { logger } from '../utils/logger';

// Obtener todas las técnicas
export const getTecnicas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tecnicas = await tecnicaService.getTecnicas();
    res.json({ success: true, data: tecnicas });
  } catch (error) {
    next(error);
  }
};

// Obtener técnica por ID
export const getTecnica = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tecnicaId = parseInt(req.params.id);
    const tecnica = await tecnicaService.getTecnica(tecnicaId);
    
    if (!tecnica) {
      return res.status(404).json({ 
        success: false, 
        message: 'Técnica no encontrada' 
      });
    }
    
    res.json({ success: true, data: tecnica });
  } catch (error) {
    next(error);
  }
};

// Crear nueva técnica (admin)
export const crearTecnica = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { nombre, descripcion } = req.body;
    
    const tecnica = await tecnicaService.crearTecnica({
      nombre,
      descripcion,
      activo: true
    });
    
    res.status(201).json({ 
      success: true, 
      data: tecnica
    });
  } catch (error) {
    logger.error('Error al crear técnica:', error);
    next(error);
  }
};

// Actualizar técnica (admin)
export const actualizarTecnica = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const tecnicaId = parseInt(req.params.id);
    const { nombre, descripcion } = req.body;
    
    const tecnicaExistente = await tecnicaService.getTecnica(tecnicaId);
    
    if (!tecnicaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Técnica no encontrada' 
      });
    }
    
    const tecnicaActualizada = await tecnicaService.actualizarTecnica(tecnicaId, {
      nombre,
      descripcion
    });
    
    res.json({ 
      success: true, 
      data: tecnicaActualizada
    });
  } catch (error) {
    logger.error('Error al actualizar técnica:', error);
    next(error);
  }
};

// Eliminar técnica (admin)
export const eliminarTecnica = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tecnicaId = parseInt(req.params.id);
    
    const tecnicaExistente = await tecnicaService.getTecnica(tecnicaId);
    
    if (!tecnicaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Técnica no encontrada' 
      });
    }
    
    await tecnicaService.eliminarTecnica(tecnicaId);
    
    res.json({ 
      success: true, 
      message: 'Técnica eliminada correctamente' 
    });
  } catch (error) {
    logger.error('Error al eliminar técnica:', error);
    next(error);
  }
};
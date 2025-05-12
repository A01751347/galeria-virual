import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as categoriaService from '../services/categoriaService';
import { logger } from '../utils/logger';

// Obtener todas las categorías
export const getCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorias = await categoriaService.getCategorias();
    res.json({ success: true, data: categorias });
  } catch (error) {
    next(error);
  }
};

// Obtener categoría por ID
export const getCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoriaId = parseInt(req.params.id);
    const categoria = await categoriaService.getCategoria(categoriaId);
    
    if (!categoria) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada' 
      });
    }
    
    res.json({ success: true, data: categoria });
  } catch (error) {
    next(error);
  }
};

// Crear nueva categoría (admin)
export const crearCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { nombre, descripcion } = req.body;
    
    const categoria = await categoriaService.crearCategoria({
      nombre,
      descripcion,
      activo: true
    });
    
    res.status(201).json({ 
      success: true, 
      data: categoria
    });
  } catch (error) {
    logger.error('Error al crear categoría:', error);
    next(error);
  }
};

// Actualizar categoría (admin)
export const actualizarCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const categoriaId = parseInt(req.params.id);
    const { nombre, descripcion } = req.body;
    
    const categoriaExistente = await categoriaService.getCategoria(categoriaId);
    
    if (!categoriaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada' 
      });
    }
    
    const categoriaActualizada = await categoriaService.actualizarCategoria(categoriaId, {
      nombre,
      descripcion
    });
    
    res.json({ 
      success: true, 
      data: categoriaActualizada
    });
  } catch (error) {
    logger.error('Error al actualizar categoría:', error);
    next(error);
  }
};

// Eliminar categoría (admin)
export const eliminarCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoriaId = parseInt(req.params.id);
    
    const categoriaExistente = await categoriaService.getCategoria(categoriaId);
    
    if (!categoriaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada' 
      });
    }
    
    await categoriaService.eliminarCategoria(categoriaId);
    
    res.json({ 
      success: true, 
      message: 'Categoría eliminada correctamente' 
    });
  } catch (error) {
    logger.error('Error al eliminar categoría:', error);
    next(error);
  }
};

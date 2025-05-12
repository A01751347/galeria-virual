import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as artistaService from '../services/artistaService';
import { logger } from '../utils/logger';

// Obtener todos los artistas
export const getArtistas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistas = await artistaService.getArtistas();
    res.json({ success: true, data: artistas });
  } catch (error) {
    next(error);
  }
};

// Obtener artista por ID
export const getArtista = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistaId = parseInt(req.params.id);
    const artista = await artistaService.getArtista(artistaId);
    
    if (!artista) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artista no encontrado' 
      });
    }
    
    res.json({ success: true, data: artista });
  } catch (error) {
    next(error);
  }
};

// Crear nuevo artista (admin)
export const crearArtista = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Procesar imagen si fue subida
    let urlImagen = null;
    if (req.file) {
      urlImagen = `/uploads/artistas/${req.file.filename}`;
    }
    
    const { nombre, apellidos, biografia, email, telefono, sitio_web, fecha_nacimiento, nacionalidad } = req.body;
    
    const artista = await artistaService.crearArtista({
      nombre,
      apellidos,
      biografia,
      email,
      telefono,
      sitio_web,
      fecha_nacimiento,
      nacionalidad,
      url_imagen: urlImagen,
      activo: true
    });
    
    res.status(201).json({ 
      success: true, 
      data: artista
    });
  } catch (error) {
    logger.error('Error al crear artista:', error);
    next(error);
  }
};

// Actualizar artista (admin)
export const actualizarArtista = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const artistaId = parseInt(req.params.id);
    
    // Verificar si el artista existe
    const artistaExistente = await artistaService.getArtista(artistaId);
    
    if (!artistaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artista no encontrado' 
      });
    }
    
    // Procesar imagen si fue subida
    if (req.file) {
      req.body.url_imagen = `/uploads/artistas/${req.file.filename}`;
    }
    
    const artistaActualizado = await artistaService.actualizarArtista(artistaId, req.body);
    
    res.json({ 
      success: true, 
      data: artistaActualizado
    });
  } catch (error) {
    logger.error('Error al actualizar artista:', error);
    next(error);
  }
};

// Eliminar artista (admin)
export const eliminarArtista = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistaId = parseInt(req.params.id);

    const artistaExistente = await artistaService.getArtista(artistaId);

    if (!artistaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Artista no encontrado' 
      });
    }

    await artistaService.eliminarArtista(artistaId);

    return res.status(200).json({
      success: true,
      message: 'Artista eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error al eliminar artista:', error);
    next(error);
  }
};

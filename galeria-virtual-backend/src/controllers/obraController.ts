import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as obraService from '../services/obraService';
import { generarQR } from '../services/qrService';
import { logger } from '../utils/logger';

// Obtener todas las obras
export const getObras = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Unificar nombres de parámetros para compatibilidad con el frontend
    const params = {
      id_categoria: req.query.category_id || req.query.id_categoria,
      id_artista: req.query.artist_id || req.query.id_artista,
      id_tecnica: req.query.technique_id || req.query.id_tecnica,
      precio_min: req.query.min_price || req.query.precio_min,
      precio_max: req.query.max_price || req.query.precio_max,
      anio_desde: req.query.year_from || req.query.anio_desde,
      anio_hasta: req.query.year_to || req.query.anio_hasta,
      disponibles: req.query.available_only === 'true' || req.query.disponibles === 'true',
      termino: req.query.search_term || req.query.termino,
      ordenar: req.query.sort_by || req.query.ordenar
    };
    
    console.log('Parámetros de filtrado:', params);
    
    const obras = await obraService.obtenerObras(params);
    res.json({ success: true, data: obras });
  } catch (error) {
    next(error);
  }
};

// Obtener obras destacadas
export const getObrasDestacadas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obras = await obraService.obtenerObrasDestacadas();
    res.json({ success: true, data: obras });
  } catch (error) {
    next(error);
  }
};

// Obtener obras por categoría
export const getObrasPorCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoriaId = parseInt(req.params.categoriaId);
    const soloDisponibles = req.query.disponibles === 'true';
    const obras = await obraService.obtenerObrasPorCategoria(categoriaId, soloDisponibles);
    res.json({ success: true, data: obras });
  } catch (error) {
    next(error);
  }
};

// Obtener obras por artista
export const getObrasPorArtista = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistaId = parseInt(req.params.artistaId);
    const soloDisponibles = req.query.disponibles === 'true';
    const obras = await obraService.obtenerObrasPorArtista(artistaId, soloDisponibles);
    res.json({ success: true, data: obras });
  } catch (error) {
    next(error);
  }
};

// Buscar obras
export const buscarObras = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const termino = req.query.termino as string;
    const soloDisponibles = req.query.disponibles === 'true';
    const obras = await obraService.buscarObras(termino, soloDisponibles);
    res.json({ success: true, data: obras });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de una obra
export const getDetalleObra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identificador = req.params.id;
    const esCodigoQr = req.query.tipo === 'qr';
    
    const obra = await obraService.obtenerDetalleObra(identificador, esCodigoQr);
    
    if (!obra) {
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    res.json({ success: true, data: obra });
  } catch (error) {
    next(error);
  }
};

// Crear una nueva obra
export const crearObra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Procesar imagen si fue subida
    let urlImagenPrincipal = req.body.url_imagen_principal;
    if (req.file) {
      urlImagenPrincipal = `/uploads/obras/${req.file.filename}`;
    }
    
    // Crear obra en la base de datos
    const nuevaObra = await obraService.crearObra({
      ...req.body,
      url_imagen_principal: urlImagenPrincipal,
      precio: parseFloat(req.body.precio),
      id_artista: parseInt(req.body.id_artista),
      id_categoria: parseInt(req.body.id_categoria),
      id_tecnica: parseInt(req.body.id_tecnica)
    });
    
    // Generar QR para la obra
    const qrUrl = await generarQR(nuevaObra.codigo_qr, nuevaObra.id!);
    
    // Actualizar URL del QR en la base de datos
    await obraService.actualizarQRObra(nuevaObra.id!, qrUrl);
    
    res.status(201).json({ 
      success: true, 
      data: { ...nuevaObra, qr_url: qrUrl } 
    });
  } catch (error) {
    logger.error('Error al crear obra:', error);
    next(error);
  }
};
// Actualizar una obra
export const actualizarObra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obraId = parseInt(req.params.id);
    
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Procesar imagen si fue subida
    if (req.file) {
      req.body.url_imagen_principal = `/uploads/obras/${req.file.filename}`;
    }
    
    // Actualizar obra
    const obraActualizada = await obraService.actualizarObra(obraId, req.body);
    
    if (!obraActualizada) {
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      data: obraActualizada 
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una obra (soft delete)
export const eliminarObra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obraId = parseInt(req.params.id);
    const resultado = await obraService.eliminarObra(obraId);
    
    if (!resultado) {
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Obra eliminada correctamente' 
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de disponibilidad/destacado
export const actualizarEstadoObra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obraId = parseInt(req.params.id);
    const { disponible, destacado } = req.body;
    
    const resultado = await obraService.actualizarEstadoObra(obraId, disponible, destacado);
    
    if (!resultado) {
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Estado de obra actualizado correctamente' 
    });
  } catch (error) {
    next(error);
  }
};
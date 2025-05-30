import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as obraService from '../services/obraService';
import { generarQR } from '../services/qrService';
import { logger } from '../utils/logger';
import { processUploadedFile } from '../services/uploadService';

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
// En src/controllers/obraController.ts
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
    // En obraController.ts dentro de crearObra
    // Procesar imagen si fue subida
    let urlImagenPrincipal = req.body.url_imagen_principal || null;
    if (req.file) {
      try {
        // Importar el servicio de S3 para subir la imagen
        const { processImageAndUploadToS3 } = require('../services/s3Service');
        
        // Procesar la imagen y subirla a S3
        urlImagenPrincipal = await processImageAndUploadToS3(req.file.path, 'obras');
      } catch (error) {
        logger.error('Error al procesar imagen de obra:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al procesar la imagen'
        });
      }
    }
    
    // Datos validados y sanitizados
    const obraData = {
      titulo: req.body.titulo || '',
      id_artista: parseInt(req.body.id_artista) || 0,
      id_categoria: parseInt(req.body.id_categoria) || 0,
      id_tecnica: parseInt(req.body.id_tecnica) || 0,
      anio_creacion: req.body.anio_creacion ? parseInt(req.body.anio_creacion) : 1,
      dimensiones: req.body.dimensiones || null,
      precio: parseFloat(req.body.precio) || 0,
      descripcion: req.body.descripcion || '',
      historia: req.body.historia || null,
      url_imagen_principal: urlImagenPrincipal,
      disponible: req.body.disponible === 'false' ? false : true,
      destacado: req.body.destacado === 'true' ? true : false
    };
    
    logger.info('Datos sanitizados antes de crear obra:', obraData);
    
    // Crear obra en la base de datos
    const nuevaObra = await obraService.crearObra(obraData);
    
    // Generar QR para la obra
    let qrUrl = null;
    try {
      qrUrl = await generarQR(nuevaObra.codigo_qr, nuevaObra.id!);
      
      // Actualizar URL del QR en la base de datos
      await obraService.actualizarQRObra(nuevaObra.id!, qrUrl);
    } catch (qrError) {
      logger.error('Error al generar QR (no afecta a la creación de la obra):', qrError);
      // No interrumpir el flujo por un error en el QR
    }
    
    res.status(201).json({ 
      success: true, 
      data: { 
        id: nuevaObra.id,
        titulo: nuevaObra.titulo,
        url_imagen_principal: nuevaObra.url_imagen_principal,
        qr_url: qrUrl 
      } 
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
    
    // Logging para debugging
    logger.info(`[DEBUG] Petición de actualización para obra ID: ${obraId}`);
    logger.info(`[DEBUG] Cabeceras de petición: ${JSON.stringify(req.headers)}`);
    logger.info(`[DEBUG] Cuerpo de petición: ${JSON.stringify(req.body)}`);
    logger.info(`[DEBUG] Usuario autenticado: ${JSON.stringify(req.usuario)}`);
    
    if (req.file) {
      logger.info(`[DEBUG] Archivo recibido: ${req.file.filename}`);
    }
    
    // Validar request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`[DEBUG] Errores de validación: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Procesar imagen si fue subida
    if (req.file) {
      req.body.url_imagen_principal = `/uploads/obras/${req.file.filename}`;
      logger.info(`[DEBUG] URL de imagen asignada: ${req.body.url_imagen_principal}`);
    }
    
    // Actualizar obra
    logger.info(`[DEBUG] Intentando actualizar obra con datos: ${JSON.stringify(req.body)}`);
    const obraActualizada = await obraService.actualizarObra(obraId, req.body);
    
    if (!obraActualizada) {
      logger.warn(`[DEBUG] No se encontró la obra con ID: ${obraId}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    logger.info(`[DEBUG] Obra actualizada exitosamente: ${JSON.stringify(obraActualizada)}`);
    res.json({ 
      success: true, 
      data: obraActualizada 
    });
  } catch (error) {
    logger.error(`[DEBUG] Error al actualizar obra: ${error}`);
    if (error instanceof Error) {
      logger.error(`[DEBUG] Mensaje de error: ${error.message}`);
      logger.error(`[DEBUG] Stack de error: ${error.stack}`);
    }
    next(error);
  }
};

// Eliminar una obra (soft delete)
// src/controllers/obraController.ts
// Función eliminarObra

export const eliminarObra = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obraId = parseInt(req.params.id);
    
    // Obtener la obra antes de eliminarla para tener acceso a la URL de la imagen
    const obra = await obraService.obtenerDetalleObra(obraId.toString());
    
    if (!obra) {
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    // Realizar el borrado lógico (soft delete) en la base de datos
    const resultado = await obraService.eliminarObra(obraId);
    
    // Si la eliminación fue exitosa y tenemos una URL de imagen en S3, eliminarla también
    if (resultado && obra.url_imagen_principal && obra.url_imagen_principal.includes('amazonaws.com')) {
      try {
        // Importamos el servicio S3 para eliminar la imagen
        const { deleteFileFromS3 } = require('../services/s3Service');
        await deleteFileFromS3(obra.url_imagen_principal);
        logger.info(`Imagen eliminada de S3: ${obra.url_imagen_principal}`);
      } catch (s3Error) {
        // Si hay un error al eliminar de S3, lo registramos pero no afecta la respuesta
        logger.error(`Error al eliminar imagen de S3: ${s3Error}`);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Obra eliminada correctamente' 
    });
  } catch (error) {
    logger.error(`Error al eliminar obra:`, error);
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
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as consultaService from '../services/consultaService';
import * as emailService from '../services/emailService';
import { logger } from '../utils/logger';

// Crear nueva consulta/oferta
export const crearConsulta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Obtener datos del formulario
    const { id_obra, nombre, email, telefono, mensaje, es_oferta, monto_oferta } = req.body;
    
    // ID de usuario si está autenticado
    const id_usuario = req.usuario ? req.usuario.id : null;
    
    // Crear la consulta
    const consulta = await consultaService.crearConsulta({
      id_obra,
      id_usuario,
      nombre,
      email,
      telefono,
      mensaje,
      es_oferta: es_oferta || false,
      monto_oferta: es_oferta ? monto_oferta : null,
      estado: 'pendiente',
      activo: true
    });
    
    // Enviar notificación por email al administrador
    try {
      await emailService.enviarNotificacionNuevaConsulta(consulta);
    } catch (emailError) {
      logger.error('Error al enviar email de notificación:', emailError);
      // Continuar con la ejecución aunque falle el envío de email
    }
    
    res.status(201).json({ 
      success: true, 
      data: consulta
    });
  } catch (error) {
    logger.error('Error al crear consulta:', error);
    next(error);
  }
};

// Obtener todas las consultas (admin)
export const getConsultas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultas = await consultaService.getConsultas();
    res.json({ success: true, data: consultas });
  } catch (error) {
    next(error);
  }
};

// Obtener consultas recientes (admin)
export const getConsultasRecientes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const consultas = await consultaService.getConsultasRecientes(limit);
    res.json({ success: true, data: consultas });
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de consulta (admin)
export const actualizarEstadoConsulta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultaId = parseInt(req.params.id);
    const { estado } = req.body;
    
    const resultado = await consultaService.actualizarEstadoConsulta(consultaId, estado);
    
    if (!resultado) {
      return res.status(404).json({ 
        success: false, 
        message: 'Consulta no encontrada' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Estado de consulta actualizado correctamente' 
    });
  } catch (error) {
    next(error);
  }
};

// Responder a consulta (admin)
export const responderConsulta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultaId = parseInt(req.params.id);
    const { respuesta } = req.body;
    
    const consulta = await consultaService.getConsultaPorId(consultaId);
    
    if (!consulta) {
      return res.status(404).json({ 
        success: false, 
        message: 'Consulta no encontrada' 
      });
    }
    
    // Enviar email de respuesta
    try {
      await emailService.enviarRespuestaConsulta(consulta, respuesta);
    } catch (emailError) {
      logger.error('Error al enviar email de respuesta:', emailError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al enviar respuesta por email' 
      });
    }
    
    // Actualizar estado de la consulta
    await consultaService.actualizarEstadoConsulta(consultaId, 'respondida');
    
    res.json({ 
      success: true, 
      message: 'Respuesta enviada correctamente' 
    });
  } catch (error) {
    next(error);
  }
};

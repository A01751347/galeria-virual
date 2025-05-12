import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as ventaService from '../services/ventaService';
import * as obraService from '../services/obraService';
import * as emailService from '../services/emailService';
import { logger } from '../utils/logger';

// Registrar nueva venta (admin)
export const registrarVenta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { id_obra, id_usuario, nombre_comprador, email_comprador, telefono_comprador, metodo_pago, referencia_pago, notas } = req.body;
    
    // Verificar si la obra existe y está disponible
    const obra = await obraService.obtenerDetalleObra(id_obra.toString());
    
    if (!obra) {
      return res.status(404).json({ 
        success: false, 
        message: 'Obra no encontrada' 
      });
    }
    
    if (!obra.disponible) {
      return res.status(400).json({ 
        success: false, 
        message: 'La obra ya no está disponible' 
      });
    }
    
    // Registrar la venta
    const venta = await ventaService.registrarVenta({
      id_obra,
      id_usuario,
      nombre_comprador,
      email_comprador,
      telefono_comprador,
      metodo_pago,
      referencia_pago,
      notas,
      estado: 'pendiente'
    });
    
    // Enviar confirmación por email
    try {
      await emailService.enviarConfirmacionVenta({
        ...venta,
        titulo_obra: obra.titulo
      });
    } catch (emailError) {
      logger.error('Error al enviar email de confirmación:', emailError);
      // Continuar con la ejecución aunque falle el envío de email
    }
    
    res.status(201).json({ 
      success: true, 
      data: venta
    });
  } catch (error) {
    logger.error('Error al registrar venta:', error);
    next(error);
  }
};

// Obtener todas las ventas (admin)
export const getVentas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventas = await ventaService.getVentas();
    res.json({ success: true, data: ventas });
  } catch (error) {
    next(error);
  }
};

// Obtener ventas recientes (admin)
export const getVentasRecientes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const ventas = await ventaService.getVentasRecientes(limit);
    res.json({ success: true, data: ventas });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de venta (admin)
export const getDetalleVenta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventaId = parseInt(req.params.id);
    const venta = await ventaService.getDetalleVenta(ventaId);
    
    if (!venta) {
      return res.status(404).json({ 
        success: false, 
        message: 'Venta no encontrada' 
      });
    }
    
    res.json({ success: true, data: venta });
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de venta (admin)
export const actualizarEstadoVenta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventaId = parseInt(req.params.id);
    const { estado } = req.body;
    
    const venta = await ventaService.getDetalleVenta(ventaId);
    
    if (!venta) {
      return res.status(404).json({ 
        success: false, 
        message: 'Venta no encontrada' 
      });
    }
    
    await ventaService.actualizarEstadoVenta(ventaId, estado);
    
    // Si el estado es 'pagado', marcar la obra como no disponible
    if (estado === 'pagado') {
      await obraService.actualizarEstadoObra(venta.id_obra, false, false);
    }
    
    res.json({ 
      success: true, 
      message: 'Estado de venta actualizado correctamente' 
    });
  } catch (error) {
    next(error);
  }
};

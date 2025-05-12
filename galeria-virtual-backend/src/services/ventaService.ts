import db from '../config/database';
import { Venta } from '../models/tipos';
import { logger } from '../utils/logger';

// Registrar venta
export const registrarVenta = async (venta: Partial<Venta>): Promise<Venta> => {
  try {
    const resultado = await db.procedure<any>('sp_registrar_venta', [
      venta.id_obra,
      venta.id_usuario || null,
      venta.nombre_comprador || null,
      venta.email_comprador,
      venta.telefono_comprador || null,
      venta.metodo_pago,
      venta.referencia_pago || null,
      venta.notas || null,
      null // OUT parámetro
    ]);
    
    // El procedimiento devuelve el ID de la venta creada
    const ventaId = resultado.p_id_venta;
    
    // Obtener la venta completa
    const query = `
      SELECT v.*, o.titulo as titulo_obra
      FROM ventas v
      JOIN obras o ON v.id_obra = o.id
      WHERE v.id = ?
    `;
    const ventas = await db.query<Venta[]>(query, [ventaId]);
    
    if (ventas.length === 0) {
      throw new Error('Error al recuperar la venta creada');
    }
    
    return ventas[0];
  } catch (error) {
    logger.error('Error al registrar venta:', error);
    throw error;
  }
};

// Obtener todas las ventas
export const getVentas = async (): Promise<Venta[]> => {
  try {
    const query = `
      SELECT v.*, o.titulo as titulo_obra, a.nombre as nombre_artista, a.apellidos as apellidos_artista
      FROM ventas v
      JOIN obras o ON v.id_obra = o.id
      JOIN artistas a ON o.id_artista = a.id
      ORDER BY v.fecha_venta DESC
    `;
    
    return await db.query<Venta[]>(query);
  } catch (error) {
    logger.error('Error al obtener ventas:', error);
    throw error;
  }
};

// Obtener ventas recientes
export const getVentasRecientes = async (limit: number = 5): Promise<Venta[]> => {
  try {
    const query = `
      SELECT v.*, o.titulo as titulo_obra, a.nombre as nombre_artista, a.apellidos as apellidos_artista
      FROM ventas v
      JOIN obras o ON v.id_obra = o.id
      JOIN artistas a ON o.id_artista = a.id
      ORDER BY v.fecha_venta DESC
      LIMIT ?
    `;
    
    return await db.query<Venta[]>(query, [limit]);
  } catch (error) {
    logger.error('Error al obtener ventas recientes:', error);
    throw error;
  }
};

// Obtener detalle de venta
export const getDetalleVenta = async (id: number): Promise<Venta | null> => {
  try {
    const query = `
      SELECT v.*, o.titulo as titulo_obra, a.nombre as nombre_artista, a.apellidos as apellidos_artista
      FROM ventas v
      JOIN obras o ON v.id_obra = o.id
      JOIN artistas a ON o.id_artista = a.id
      WHERE v.id = ?
    `;
    
    const ventas = await db.query<Venta[]>(query, [id]);
    
    return ventas.length > 0 ? ventas[0] : null;
  } catch (error) {
    logger.error(`Error al obtener detalle de venta ${id}:`, error);
    throw error;
  }
};

// Actualizar estado de venta
export const actualizarEstadoVenta = async (id: number, estado: 'pendiente' | 'pagado' | 'entregado' | 'cancelado'): Promise<boolean> => {
  try {
    const query = 'UPDATE ventas SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    
    const result = await db.query(query, [estado, id]);
    
    return (result as any).affectedRows > 0;
  } catch (error) {
    logger.error(`Error al actualizar estado de venta ${id}:`, error);
    throw error;
  }
};

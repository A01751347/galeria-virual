import db from '../config/database';
import { Consulta } from '../models/tipos';
import { logger } from '../utils/logger';

// Crear consulta
export const crearConsulta = async (consulta: Partial<Consulta>): Promise<Consulta> => {
  try {
    return await db.procedure<any>('sp_registrar_consulta', [
      consulta.id_obra,
      consulta.id_usuario || null,
      consulta.nombre || null,
      consulta.email,
      consulta.telefono || null,
      consulta.mensaje,
      consulta.es_oferta || false,
      consulta.monto_oferta || null,
      null // OUT parámetro
    ]);
  } catch (error) {
    logger.error('Error al crear consulta:', error);
    throw error;
  }
};

// Obtener todas las consultas
export const getConsultas = async (): Promise<Consulta[]> => {
  try {
    const query = `
      SELECT c.*, o.titulo as titulo_obra, a.nombre as nombre_artista, a.apellidos as apellidos_artista
      FROM consultas c
      JOIN obras o ON c.id_obra = o.id
      JOIN artistas a ON o.id_artista = a.id
      WHERE c.activo = TRUE
      ORDER BY c.fecha_creacion DESC
    `;
    
    return await db.query<Consulta[]>(query);
  } catch (error) {
    logger.error('Error al obtener consultas:', error);
    throw error;
  }
};

// Obtener consultas recientes
export const getConsultasRecientes = async (limit: number = 5): Promise<Consulta[]> => {
  try {
    const query = `
      SELECT c.*, o.titulo as titulo_obra, a.nombre as nombre_artista, a.apellidos as apellidos_artista
      FROM consultas c
      JOIN obras o ON c.id_obra = o.id
      JOIN artistas a ON o.id_artista = a.id
      WHERE c.activo = TRUE
      ORDER BY c.fecha_creacion DESC
      LIMIT ?
    `;
    
    return await db.query<Consulta[]>(query, [limit]);
  } catch (error) {
    logger.error('Error al obtener consultas recientes:', error);
    throw error;
  }
};

// Obtener consulta por ID
export const getConsultaPorId = async (id: number): Promise<Consulta | null> => {
  try {
    const query = `
      SELECT c.*, o.titulo as titulo_obra, a.nombre as nombre_artista, a.apellidos as apellidos_artista
      FROM consultas c
      JOIN obras o ON c.id_obra = o.id
      JOIN artistas a ON o.id_artista = a.id
      WHERE c.id = ? AND c.activo = TRUE
    `;
    
    const consultas = await db.query<Consulta[]>(query, [id]);
    
    return consultas.length > 0 ? consultas[0] : null;
  } catch (error) {
    logger.error(`Error al obtener consulta ${id}:`, error);
    throw error;
  }
};

// Actualizar estado de consulta
export const actualizarEstadoConsulta = async (id: number, estado: 'pendiente' | 'respondida' | 'aceptada' | 'rechazada'): Promise<boolean> => {
  try {
    const query = 'UPDATE consultas SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ? AND activo = TRUE';
    
    const result = await db.query(query, [estado, id]);
    
    return (result as any).affectedRows > 0;
  } catch (error) {
    logger.error(`Error al actualizar estado de consulta ${id}:`, error);
    throw error;
  }
};

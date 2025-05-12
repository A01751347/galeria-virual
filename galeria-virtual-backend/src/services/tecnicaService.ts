import db from '../config/database';
import { Tecnica } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener todas las técnicas
export const getTecnicas = async (): Promise<Tecnica[]> => {
  try {
    const query = 'SELECT * FROM tecnicas WHERE activo = TRUE';
    return await db.query<Tecnica[]>(query);
  } catch (error) {
    logger.error('Error al obtener técnicas:', error);
    throw error;
  }
};

// Obtener técnica por ID
export const getTecnica = async (id: number): Promise<Tecnica | null> => {
  try {
    const query = 'SELECT * FROM tecnicas WHERE id = ? AND activo = TRUE';
    const tecnicas = await db.query<Tecnica[]>(query, [id]);
    return tecnicas.length > 0 ? tecnicas[0] : null;
  } catch (error) {
    logger.error(`Error al obtener técnica ${id}:`, error);
    throw error;
  }
};

// Crear técnica
export const crearTecnica = async (tecnica: Partial<Tecnica>): Promise<Tecnica> => {
  try {
    const query = `
      INSERT INTO tecnicas (nombre, descripcion, activo)
      VALUES (?, ?, TRUE)
    `;
    
    const result = await db.query(query, [
      tecnica.nombre,
      tecnica.descripcion || null
    ]);
    
    const id = (result as any).insertId;
    return { id, ...tecnica, activo: true } as Tecnica;
  } catch (error) {
    logger.error('Error al crear técnica:', error);
    throw error;
  }
};

// Actualizar técnica
export const actualizarTecnica = async (id: number, datos: Partial<Tecnica>): Promise<Tecnica | null> => {
  try {
    // Verificar si existe la técnica
    const tecnicaExistente = await getTecnica(id);
    if (!tecnicaExistente) {
      return null;
    }
    
    // Construir query dinámica
    let query = 'UPDATE tecnicas SET ';
    const params = [];
    
    // Agregar cada campo a actualizar
    Object.entries(datos).forEach(([key, value], index) => {
      // Omitir campos que no se deben actualizar directamente
      if (!['id', 'fecha_creacion', 'fecha_actualizacion', 'activo'].includes(key)) {
        query += `${key} = ?${index < Object.keys(datos).length - 1 ? ', ' : ''}`;
        params.push(value);
      }
    });
    
    // Agregar condición WHERE y fecha de actualización
    query += ', fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    params.push(id);
    
    // Ejecutar la actualización
    await db.query(query, params);
    
    // Devolver la técnica actualizada
    return await getTecnica(id);
  } catch (error) {
    logger.error(`Error al actualizar técnica ${id}:`, error);
    throw error;
  }
};

// Eliminar técnica (soft delete)
export const eliminarTecnica = async (id: number): Promise<boolean> => {
  try {
    const query = 'UPDATE tecnicas SET activo = FALSE, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await db.query(query, [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    logger.error(`Error al eliminar técnica ${id}:`, error);
    throw error;
  }
};
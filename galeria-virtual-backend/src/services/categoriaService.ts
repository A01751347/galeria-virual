import db from '../config/database';
import { Categoria } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener todas las categorías
export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const query = 'SELECT * FROM categorias WHERE activo = TRUE';
    return await db.query<Categoria[]>(query);
  } catch (error) {
    logger.error('Error al obtener categorías:', error);
    throw error;
  }
};

// Obtener categoría por ID
export const getCategoria = async (id: number): Promise<Categoria | null> => {
  try {
    const query = 'SELECT * FROM categorias WHERE id = ? AND activo = TRUE';
    const categorias = await db.query<Categoria[]>(query, [id]);
    return categorias.length > 0 ? categorias[0] : null;
  } catch (error) {
    logger.error(`Error al obtener categoría ${id}:`, error);
    throw error;
  }
};

// Crear categoría
export const crearCategoria = async (categoria: Partial<Categoria>): Promise<Categoria> => {
  try {
    const query = `
      INSERT INTO categorias (nombre, descripcion, activo)
      VALUES (?, ?, TRUE)
    `;
    
    const result = await db.query(query, [
      categoria.nombre,
      categoria.descripcion || null
    ]);
    
    const id = (result as any).insertId;
    return { id, ...categoria, activo: true } as Categoria;
  } catch (error) {
    logger.error('Error al crear categoría:', error);
    throw error;
  }
};

// Actualizar categoría
export const actualizarCategoria = async (id: number, datos: Partial<Categoria>): Promise<Categoria | null> => {
  try {
    // Verificar si existe la categoría
    const categoriaExistente = await getCategoria(id);
    if (!categoriaExistente) {
      return null;
    }
    
    // Construir query dinámica
    let query = 'UPDATE categorias SET ';
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
    
    // Devolver la categoría actualizada
    return await getCategoria(id);
  } catch (error) {
    logger.error(`Error al actualizar categoría ${id}:`, error);
    throw error;
  }
};

// Eliminar categoría (soft delete)
export const eliminarCategoria = async (id: number): Promise<boolean> => {
  try {
    const query = 'UPDATE categorias SET activo = FALSE, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await db.query(query, [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    logger.error(`Error al eliminar categoría ${id}:`, error);
    throw error;
  }
};
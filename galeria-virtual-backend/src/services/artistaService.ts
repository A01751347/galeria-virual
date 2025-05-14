import db from '../config/database';
import { Artista } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener todos los artistas
export const getArtistas = async (): Promise<Artista[]> => {
  try {
    const query = 'SELECT * FROM artistas WHERE activo = TRUE';
    return await db.query<Artista[]>(query);
  } catch (error) {
    logger.error('Error al obtener artistas:', error);
    throw error;
  }
};

// Obtener artista por ID
export const getArtista = async (id: number): Promise<Artista | null> => {
  try {
    const query = 'SELECT * FROM artistas WHERE id = ? AND activo = TRUE';
    const artistas = await db.query<Artista[]>(query, [id]);
    return artistas.length > 0 ? artistas[0] : null;
  } catch (error) {
    logger.error(`Error al obtener artista ${id}:`, error);
    throw error;
  }
};

// Crear artista
// src/services/artistaService.ts

export const crearArtista = async (artista: Partial<Artista>): Promise<Artista> => {
  try {
    const query = `
      INSERT INTO artistas (
        nombre,
        apellidos,
        biografia,
        email,
        telefono,
        sitio_web,
        fecha_nacimiento,
        url_imagen,
        nacionalidad,
        activo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    
    const result = await db.query(query, [
      artista.nombre,
      artista.apellidos,
      artista.biografia  || null,
      artista.email      || null,
      artista.telefono   || null,
      artista.sitio_web  || null,
      artista.fecha_nacimiento || null,
      artista.url_imagen || null,   // ← aquí reingresamos la URL
      artista.nacionalidad || null
    ]);
    
    const id = (result as any).insertId;
    return {
      id,
      nombre: artista.nombre!,
      apellidos: artista.apellidos!,
      biografia: artista.biografia   || '',
      email: artista.email           || '',
      telefono: artista.telefono     || '',
      sitio_web: artista.sitio_web   || '',
      fecha_nacimiento: artista.fecha_nacimiento || null,
      url_imagen: artista.url_imagen || '',
      nacionalidad: artista.nacionalidad || '',
      activo: true,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    } as Artista;
  } catch (error) {
    logger.error('Error al crear artista:', error);
    throw error;
  }
};


// Actualizar artista
export const actualizarArtista = async (id: number, datos: Partial<Artista>): Promise<Artista | null> => {
  try {
    // Verificar si existe el artista
    const artistaExistente = await getArtista(id);
    if (!artistaExistente) {
      return null;
    }
    
    // Construir query dinámica
    let query = 'UPDATE artistas SET ';
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
    
    // Devolver el artista actualizado
    return await getArtista(id);
  } catch (error) {
    logger.error(`Error al actualizar artista ${id}:`, error);
    throw error;
  }
};

// Eliminar artista (soft delete)
export const eliminarArtista = async (id: number): Promise<boolean> => {
  try {
    const query = 'UPDATE artistas SET activo = FALSE, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await db.query(query, [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    logger.error(`Error al eliminar artista ${id}:`, error);
    throw error;
  }
};
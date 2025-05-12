import db from '../config/database';
import { Usuario } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener usuario por ID
export const getUsuarioPorId = async (id: number): Promise<Usuario | null> => {
  try {
    const query = 'SELECT * FROM usuarios WHERE id = ? AND activo = TRUE';
    const usuarios = await db.query<Usuario[]>(query, [id]);
    
    return usuarios.length > 0 ? usuarios[0] : null;
  } catch (error) {
    logger.error(`Error al obtener usuario ${id}:`, error);
    throw error;
  }
};

// Obtener usuario por email
export const getUsuarioPorEmail = async (email: string): Promise<Usuario | null> => {
  try {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const usuarios = await db.query<Usuario[]>(query, [email]);
    
    return usuarios.length > 0 ? usuarios[0] : null;
  } catch (error) {
    logger.error(`Error al obtener usuario por email ${email}:`, error);
    throw error;
  }
};

// Crear nuevo usuario
export const crearUsuario = async (usuario: Partial<Usuario>): Promise<Usuario> => {
  try {
    const query = `
      INSERT INTO usuarios (nombre, apellidos, email, contrasena, telefono, rol, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      usuario.nombre,
      usuario.apellidos,
      usuario.email,
      usuario.contrasena,
      usuario.telefono || null,
      usuario.rol || 'cliente',
      usuario.activo || true
    ];
    
    const result = await db.query(query, params);
    const id = (result as any).insertId;
    
    return { id, ...usuario } as Usuario;
  } catch (error) {
    logger.error('Error al crear usuario:', error);
    throw error;
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id: number, datos: Partial<Usuario>): Promise<boolean> => {
  try {
    // Construir query dinámica
    let query = 'UPDATE usuarios SET ';
    const params = [];
    
    // Agregar cada campo a actualizar
    Object.entries(datos).forEach(([key, value], index) => {
      // No permitir actualizar campos sensibles directamente
      if (!['id', 'contrasena', 'rol', 'fecha_creacion', 'fecha_actualizacion', 'ultimo_acceso', 'activo'].includes(key)) {
        query += `${key} = ?${index < Object.entries(datos).length - 1 ? ', ' : ''}`;
        params.push(value);
      }
    });
    
    // Si se intenta actualizar la contraseña, asegurar que ya venga hasheada
    if (datos.contrasena) {
      query += ', contrasena = ?';
      params.push(datos.contrasena);
    }
    
    // Agregar condición WHERE y fecha de actualización
    query += ', fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    params.push(id);
    
    // Ejecutar la actualización
    await db.query(query, params);
    
    return true;
  } catch (error) {
    logger.error(`Error al actualizar usuario ${id}:`, error);
    throw error;
  }
};

// Actualizar último acceso
export const actualizarUltimoAcceso = async (id: number): Promise<boolean> => {
  try {
    const query = 'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(query, [id]);
    
    return true;
  } catch (error) {
    logger.error(`Error al actualizar último acceso de usuario ${id}:`, error);
    throw error;
  }
};

// Cambiar contraseña
export const cambiarContrasena = async (id: number, nuevaContrasena: string): Promise<boolean> => {
  try {
    const query = 'UPDATE usuarios SET contrasena = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(query, [nuevaContrasena, id]);
    
    return true;
  } catch (error) {
    logger.error(`Error al cambiar contraseña de usuario ${id}:`, error);
    throw error;
  }
};

// Desactivar usuario (soft delete)
export const desactivarUsuario = async (id: number): Promise<boolean> => {
  try {
    const query = 'UPDATE usuarios SET activo = FALSE, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(query, [id]);
    
    return true;
  } catch (error) {
    logger.error(`Error al desactivar usuario ${id}:`, error);
    throw error;
  }
};

// Obtener todos los usuarios (admin)
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const query = 'SELECT id, nombre, apellidos, email, telefono, rol, ultimo_acceso, fecha_creacion, fecha_actualizacion, activo FROM usuarios';
    return await db.query<Usuario[]>(query);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    throw error;
  }
};

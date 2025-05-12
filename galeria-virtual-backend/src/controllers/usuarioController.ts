import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import * as usuarioService from '../services/usuarioService';
import { logger } from '../utils/logger';

// Obtener todos los usuarios (admin)
export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarios = await usuarioService.getUsuarios();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario por ID (admin o mismo usuario)
export const getUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarioId = parseInt(req.params.id);
    
    // Verificar permisos: solo admin o el mismo usuario pueden ver detalles
    if (req.usuario?.rol !== 'admin' && req.usuario?.id !== usuarioId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para ver este usuario' 
      });
    }
    
    const usuario = await usuarioService.getUsuarioPorId(usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // No devolver contraseña
    const { contrasena, ...usuarioSinContrasena } = usuario;
    
    res.json({ 
      success: true, 
      data: usuarioSinContrasena
    });
  } catch (error) {
    next(error);
  }
};

// Crear nuevo usuario (admin)
export const crearUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { nombre, apellidos, email, contrasena, telefono, rol } = req.body;
    
    // Verificar si el email ya está registrado
    const usuarioExistente = await usuarioService.getUsuarioPorEmail(email);
    
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }
    
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);
    
    // Crear nuevo usuario
    const nuevoUsuario = await usuarioService.crearUsuario({
      nombre,
      apellidos,
      email,
      contrasena: contrasenaHash,
      telefono,
      rol: rol || 'cliente',
      activo: true
    });
    
    // No devolver contraseña
    const { contrasena: _, ...usuarioSinContrasena } = nuevoUsuario;
    
    res.status(201).json({ 
      success: true, 
      data: usuarioSinContrasena
    });
  } catch (error) {
    logger.error('Error al crear usuario:', error);
    next(error);
  }
};

// Actualizar usuario (admin o mismo usuario)
export const actualizarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const usuarioId = parseInt(req.params.id);
    
    // Verificar permisos: solo admin o el mismo usuario pueden actualizar
    if (req.usuario?.rol !== 'admin' && req.usuario?.id !== usuarioId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para actualizar este usuario' 
      });
    }
    
    // Verificar si el usuario existe
    const usuarioExistente = await usuarioService.getUsuarioPorId(usuarioId);
    
    if (!usuarioExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Crear objeto con datos a actualizar
    const { nombre, apellidos, email, telefono } = req.body;
    const datosActualizacion: Partial<{
      nombre: string;
      apellidos: string;
      email: string;
      telefono: string | null;
      rol: 'admin' | 'cliente';
    }> = {
      nombre,
      apellidos,
      telefono
    };
    
    // Solo el admin puede cambiar el email y rol
    if (req.usuario?.rol === 'admin') {
      if (email) {
        // Verificar que el email no esté en uso por otro usuario
        const usuarioConEmail = await usuarioService.getUsuarioPorEmail(email);
        if (usuarioConEmail && usuarioConEmail.id !== usuarioId) {
          return res.status(400).json({ 
            success: false, 
            message: 'El email ya está en uso por otro usuario' 
          });
        }
        datosActualizacion.email = email;
      }
      
      if (req.body.rol) {
        datosActualizacion.rol = req.body.rol;
      }
    }
    
    // Actualizar usuario
    await usuarioService.actualizarUsuario(usuarioId, datosActualizacion);
    
    // Obtener usuario actualizado
    const usuarioActualizado = await usuarioService.getUsuarioPorId(usuarioId);
    
    if (!usuarioActualizado) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener el usuario actualizado' 
      });
    }
    
    // No devolver contraseña
    const { contrasena, ...usuarioSinContrasena } = usuarioActualizado;
    
    res.json({ 
      success: true, 
      data: usuarioSinContrasena
    });
  } catch (error) {
    logger.error('Error al actualizar usuario:', error);
    next(error);
  }
};

// Cambiar contraseña (admin o mismo usuario)
export const cambiarContrasena = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const usuarioId = parseInt(req.params.id);
    
    // Verificar permisos: solo admin o el mismo usuario pueden cambiar contraseña
    if (req.usuario?.rol !== 'admin' && req.usuario?.id !== usuarioId) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para cambiar la contraseña de este usuario' 
      });
    }
    
    // Verificar si el usuario existe
    const usuario = await usuarioService.getUsuarioPorId(usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Si es el mismo usuario, verificar contraseña actual
    if (req.usuario?.id === usuarioId) {
      const { contrasena_actual, nueva_contrasena } = req.body;
      
      const contrasenaValida = await bcrypt.compare(contrasena_actual, usuario.contrasena);
      
      if (!contrasenaValida) {
        return res.status(400).json({ 
          success: false, 
          message: 'La contraseña actual es incorrecta' 
        });
      }
      
      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(nueva_contrasena, salt);
      
      // Actualizar contraseña
      await usuarioService.cambiarContrasena(usuarioId, contrasenaHash);
    } else {
      // Si es admin, puede cambiar sin verificar contraseña actual
      const { nueva_contrasena } = req.body;
      
      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(nueva_contrasena, salt);
      
      // Actualizar contraseña
      await usuarioService.cambiarContrasena(usuarioId, contrasenaHash);
    }
    
    res.json({ 
      success: true, 
      message: 'Contraseña actualizada correctamente' 
    });
  } catch (error) {
    logger.error('Error al cambiar contraseña:', error);
    next(error);
  }
};

// Desactivar usuario (admin)
export const desactivarUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarioId = parseInt(req.params.id);
    
    // Verificar que no se esté intentando desactivar a sí mismo
    if (req.usuario?.id === usuarioId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes desactivar tu propia cuenta' 
      });
    }
    
    // Verificar si el usuario existe
    const usuario = await usuarioService.getUsuarioPorId(usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Desactivar usuario
    await usuarioService.desactivarUsuario(usuarioId);
    
    res.json({ 
      success: true, 
      message: 'Usuario desactivado correctamente' 
    });
  } catch (error) {
    logger.error('Error al desactivar usuario:', error);
    next(error);
  }
};
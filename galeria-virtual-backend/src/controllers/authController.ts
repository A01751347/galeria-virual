
// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioService from '../services/usuarioService';
import { logger } from '../utils/logger';

// Registrar nuevo usuario
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { nombre, apellidos, email, contrasena, telefono } = req.body;
    
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
      rol: 'cliente', // Por defecto, rol de cliente
      activo: true
    });
    
    res.status(201).json({ 
      success: true, 
      data: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellidos: nuevoUsuario.apellidos,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    logger.error('Error en registro:', error);
    next(error);
  }
};

// Login de usuario
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { email, contrasena } = req.body;
    
    // Buscar usuario por email
    const usuario = await usuarioService.getUsuarioPorEmail(email);
    
    if (!usuario) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({ 
        success: false, 
        message: 'Tu cuenta ha sido desactivada. Contacta al administrador.' 
      });
    }
    
    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!contrasenaValida) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Actualizar último acceso
    await usuarioService.actualizarUltimoAcceso(usuario.id!);
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos
      },
      process.env.JWT_SECRET || 'mi_secreto_super_seguro_para_jwt',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({ 
      success: true, 
      data: {
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          email: usuario.email,
          rol: usuario.rol
        }
      }
    });
  } catch (error) {
    logger.error('Error en login:', error);
    next(error);
  }
};

// Obtener información del usuario autenticado
export const getUsuarioInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autenticado' 
      });
    }
    
    const usuario = await usuarioService.getUsuarioPorId(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    res.json({ 
      success: true, 
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        fecha_creacion: usuario.fecha_creacion,
        ultimo_acceso: usuario.ultimo_acceso
      }
    });
  } catch (error) {
    next(error);
  }
};

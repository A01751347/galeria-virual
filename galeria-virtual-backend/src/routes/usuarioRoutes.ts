import { Router } from 'express';
import { body } from 'express-validator';
import * as usuarioController from '../controllers/usuarioController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validaciones para creación de usuario
const validacionesCreacion = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellidos').notEmpty().withMessage('Los apellidos son obligatorios'),
  body('email').isEmail().withMessage('Email inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').optional().isIn(['admin', 'cliente']).withMessage('Rol inválido')
];

// Validaciones para actualización de usuario
const validacionesActualizacion = [
  body('nombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellidos').optional().notEmpty().withMessage('Los apellidos son obligatorios'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('rol').optional().isIn(['admin', 'cliente']).withMessage('Rol inválido')
];

// Validaciones para cambio de contraseña
const validacionesCambioContrasena = [
  body('contrasena_actual').optional(), // Opcional para admin
  body('nueva_contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Rutas protegidas
router.get('/', authMiddleware, adminMiddleware, usuarioController.getUsuarios);
router.get('/:id', authMiddleware, usuarioController.getUsuario);
router.post('/', authMiddleware, adminMiddleware, validacionesCreacion, usuarioController.crearUsuario);
router.put('/:id', authMiddleware, validacionesActualizacion, usuarioController.actualizarUsuario);
router.patch('/:id/cambiar-contrasena', authMiddleware, validacionesCambioContrasena, usuarioController.cambiarContrasena);
router.delete('/:id', authMiddleware, adminMiddleware, usuarioController.desactivarUsuario);

export default router;

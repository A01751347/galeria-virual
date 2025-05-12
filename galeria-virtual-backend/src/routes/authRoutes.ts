import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Validaciones para registro
const validacionesRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellidos').notEmpty().withMessage('Los apellidos son obligatorios'),
  body('email').isEmail().withMessage('Email inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para login
const validacionesLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('contrasena').notEmpty().withMessage('La contraseña es obligatoria')
];

// Rutas
router.post('/register', validacionesRegistro, authController.register);
router.post('/login', validacionesLogin, authController.login);
router.get('/me', authMiddleware, authController.getUsuarioInfo);

export default router;
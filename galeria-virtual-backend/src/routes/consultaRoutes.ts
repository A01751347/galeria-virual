import { Router } from 'express';
import { body } from 'express-validator';
import * as consultaController from '../controllers/consultaController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validaciones para creación de consulta
const validacionesConsulta = [
  body('id_obra').isInt().withMessage('ID de obra inválido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('mensaje').notEmpty().withMessage('El mensaje es obligatorio'),
  body('es_oferta').optional().isBoolean().withMessage('es_oferta debe ser booleano'),
  body('monto_oferta').optional().isFloat({ min: 0 }).withMessage('El monto debe ser un número positivo')
];

// Validaciones para respuesta a consulta
const validacionesRespuesta = [
  body('respuesta').notEmpty().withMessage('La respuesta es obligatoria')
];

// Rutas públicas
router.post('/', validacionesConsulta, consultaController.crearConsulta);

// Rutas protegidas (admin)
router.get('/', authMiddleware, adminMiddleware, consultaController.getConsultas);
router.get('/recientes', authMiddleware, adminMiddleware, consultaController.getConsultasRecientes);
router.patch('/:id/estado', authMiddleware, adminMiddleware, consultaController.actualizarEstadoConsulta);
router.post('/:id/responder', authMiddleware, adminMiddleware, validacionesRespuesta, consultaController.responderConsulta);

export default router;

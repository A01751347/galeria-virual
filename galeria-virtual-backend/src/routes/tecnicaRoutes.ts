import { Router } from 'express';
import { body } from 'express-validator';
import * as tecnicaController from '../controllers/tecnicaController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validaciones para creación/actualización de técnica
const validacionesTecnica = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
];

// Rutas públicas
router.get('/', tecnicaController.getTecnicas);
router.get('/:id', tecnicaController.getTecnica);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, validacionesTecnica, tecnicaController.crearTecnica);
router.put('/:id', authMiddleware, adminMiddleware, validacionesTecnica, tecnicaController.actualizarTecnica);
router.delete('/:id', authMiddleware, adminMiddleware, tecnicaController.eliminarTecnica);

export default router;
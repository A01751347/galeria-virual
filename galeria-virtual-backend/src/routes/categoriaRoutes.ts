import { Router } from 'express';
import { body } from 'express-validator';
import * as categoriaController from '../controllers/categoriaController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validaciones para creación/actualización de categoría
const validacionesCategoria = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
];

// Rutas públicas
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoria);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, validacionesCategoria, categoriaController.crearCategoria);
router.put('/:id', authMiddleware, adminMiddleware, validacionesCategoria, categoriaController.actualizarCategoria);
router.delete('/:id', authMiddleware, adminMiddleware, categoriaController.eliminarCategoria);

export default router;
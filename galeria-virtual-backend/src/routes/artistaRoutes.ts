import { Router } from 'express';
import { body } from 'express-validator';
import * as artistaController from '../controllers/artistaController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { uploadArtista } from '../middleware/upload';

const router = Router();

// Validaciones para creación/actualización de artista
const validacionesArtista = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellidos').notEmpty().withMessage('Los apellidos son obligatorios'),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email inválido')
];

// Rutas públicas
router.get('/', artistaController.getArtistas);
router.get('/:id', artistaController.getArtista);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, uploadArtista.single('imagen'), validacionesArtista, artistaController.crearArtista);
router.put('/:id', authMiddleware, adminMiddleware, uploadArtista.single('imagen'), validacionesArtista, artistaController.actualizarArtista);
router.delete('/:id', authMiddleware, adminMiddleware, artistaController.eliminarArtista);

export default router;
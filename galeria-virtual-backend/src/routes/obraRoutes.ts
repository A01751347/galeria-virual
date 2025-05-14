import { Router } from 'express';
import { body } from 'express-validator';
import * as obraController from '../controllers/obraController';
import { authMiddleware } from '../middleware/auth';
import { uploadObra } from '../middleware/upload';

const router = Router();

// Validaciones para creación/actualización de obras
const validacionesObra = [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('id_artista').isInt().withMessage('ID de artista inválido'),
  body('id_categoria').isInt().withMessage('ID de categoría inválido'),
  body('id_tecnica').isInt().withMessage('ID de técnica inválido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria')
];

// Rutas públicas
router.get('/', obraController.getObras);
router.get('/destacadas', obraController.getObrasDestacadas);
router.get('/buscar', obraController.buscarObras);
router.get('/categoria/:categoriaId', obraController.getObrasPorCategoria);
router.get('/artista/:artistaId', obraController.getObrasPorArtista);
router.get('/:id', obraController.getDetalleObra);

// Rutas “protegidas” sin authMiddleware
router.post('/', uploadObra.single('imagen'), validacionesObra, obraController.crearObra);
router.put('/:id', uploadObra.single('imagen'), validacionesObra, obraController.actualizarObra);
router.patch('/:id/estado', obraController.actualizarEstadoObra);
router.delete('/:id', obraController.eliminarObra);

export default router;

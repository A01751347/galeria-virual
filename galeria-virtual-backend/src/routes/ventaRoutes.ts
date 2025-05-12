import { Router } from 'express';
import { body } from 'express-validator';
import * as ventaController from '../controllers/ventaController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Validaciones para creación de venta
const validacionesVenta = [
  body('id_obra').isInt().withMessage('ID de obra inválido'),
  body('email_comprador').isEmail().withMessage('Email inválido'),
  body('metodo_pago').notEmpty().withMessage('El método de pago es obligatorio')
];

// Validaciones para actualización de estado
const validacionesEstado = [
  body('estado').isIn(['pendiente', 'pagado', 'entregado', 'cancelado']).withMessage('Estado inválido')
];

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, validacionesVenta, ventaController.registrarVenta);
router.get('/', authMiddleware, adminMiddleware, ventaController.getVentas);
router.get('/recientes', authMiddleware, adminMiddleware, ventaController.getVentasRecientes);
router.get('/:id', authMiddleware, adminMiddleware, ventaController.getDetalleVenta);
router.patch('/:id/estado', authMiddleware, adminMiddleware, validacionesEstado, ventaController.actualizarEstadoVenta);

export default router;
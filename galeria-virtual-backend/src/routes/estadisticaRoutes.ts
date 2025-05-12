import { Router } from 'express';
import * as estadisticaController from '../controllers/estadisticaController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Rutas protegidas (admin)
router.get('/', authMiddleware, adminMiddleware, estadisticaController.getEstadisticas);

export default router;

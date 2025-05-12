import { Router } from 'express';
import obraRoutes from './obraRoutes';
import artistaRoutes from './artistaRoutes';
import categoriaRoutes from './categoriaRoutes';
import tecnicaRoutes from './tecnicaRoutes';
import consultaRoutes from './consultaRoutes';
import ventaRoutes from './ventaRoutes';
import usuarioRoutes from './usuarioRoutes';
import authRoutes from './authRoutes';
import estadisticaRoutes from './estadisticaRoutes';

const router = Router();

router.use('/obras', obraRoutes);
router.use('/artistas', artistaRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/tecnicas', tecnicaRoutes);
router.use('/consultas', consultaRoutes);
router.use('/ventas', ventaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/auth', authRoutes);
router.use('/estadisticas', estadisticaRoutes);

export default router;
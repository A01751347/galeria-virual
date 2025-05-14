import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import db from './config/database';
import routes from './routes';
import errorMiddleware from './middleware/error';
import corsMiddleware from './config/cors';
import { createUploadDirs } from './services/uploadService';
import { apiLimiter, authLimiter } from './middleware/rateLimit';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(corsMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (tu frontend en /public, p.ej. index.html, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// —————> Aquí exponemos la carpeta de subidas de Multer
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

// Limites y rutas
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', routes);

app.get('/api/status', (_req, res) => {
  res.json({
    status: 'active',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Recurso no encontrado' });
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    createUploadDirs();
    await db.testConnection();
    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en el puerto ${PORT}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV}`);
      logger.info(`URL del servidor: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;

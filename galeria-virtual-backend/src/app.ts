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


// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

app.use(helmet());
app.use(corsMiddleware);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', routes);

// Ruta para verificar el estado de la API
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Ruta para manejar peticiones no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado'
  });
});

// Manejo de errores
app.use(errorMiddleware);

// Iniciar servidor
const startServer = async () => {
  try {
    // Crear directorios de carga si no existen
    createUploadDirs();
    
    // Verificar conexión a la base de datos
    await db.testConnection();
    
    // Iniciar servidor
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
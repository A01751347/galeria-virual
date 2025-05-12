import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import db from './config/database';
//import routes from './routes';
import errorMiddleware from './middleware/error';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
//app.use('/api', routes);

// Manejo de errores
app.use(errorMiddleware);

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await db.testConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en el puerto ${PORT}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
import app from './app';
import { logger } from './utils/logger';
import db from './config/database';
import { verificarConexion as verificarConexionEmail } from './services/emailService';

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await db.testConnection();
    
    // Verificar conexión al servidor de email (no bloqueante)
    verificarConexionEmail();
    
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
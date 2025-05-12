// src/config/cors.ts
import cors from 'cors';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Opciones de configuración CORS
const corsOptions: cors.CorsOptions = {
  origin: [FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas en segundos
};

// Exportar middleware configurado
export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
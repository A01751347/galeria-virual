import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

export default (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  // Log del error
  logger.error(`Error ${statusCode}: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Error interno del servidor' : err.message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

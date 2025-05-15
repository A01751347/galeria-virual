// src/middleware/sanitizeParams.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ParsedQs } from 'qs';

/**
 * Middleware que sanitiza los parámetros de una petición para convertir 'undefined' a cadenas vacías o valores por defecto
 */
export const sanitizeRequestParams = (req: Request, res: Response, next: NextFunction) => {
  // Sanitizar req.body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === 'undefined' || req.body[key] === undefined) {
        logger.warn(`Sanitizando parámetro undefined en req.body.${key}`);
        req.body[key] = ''; // Usar cadena vacía en lugar de null
      }
    });
  }
  
  // Sanitizar req.query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (req.query[key] === 'undefined' || req.query[key] === undefined) {
        logger.warn(`Sanitizando parámetro undefined en req.query.${key}`);
        req.query[key] = ''; // Usar cadena vacía en lugar de null
      }
    });
  }
  
  // Sanitizar req.params
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (req.params[key] === 'undefined' || req.params[key] === undefined) {
        logger.warn(`Sanitizando parámetro undefined en req.params.${key}`);
        req.params[key] = ''; // Usar cadena vacía en lugar de null
      }
    });
  }
  
  next();
};
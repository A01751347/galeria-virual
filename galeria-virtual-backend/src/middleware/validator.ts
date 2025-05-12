// src/middleware/validator.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware para validar las peticiones utilizando express-validator
 * @param validations Cadena de validaciones a ejecutar
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map(validation => validation.run(req)));

    // Verificar si hay errores
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Si hay errores, devolver respuesta con los errores
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

/**
 * Validación común para IDs numéricos en parámetros
 * @param param Nombre del parámetro a validar
 */
export const validateId = (param: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[param];
    
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: `El parámetro ${param} debe ser un número positivo`
      });
    }
    
    next();
  };
};
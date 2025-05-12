// src/utils/errorTypes.ts

// Error base para la aplicación
export class AppError extends Error {
  statusCode: number;
  errors?: any[];
  
  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    
    // Para que instanceof funcione correctamente con clases extendidas
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Error 400 - Bad Request
export class BadRequestError extends AppError {
  constructor(message: string = 'Solicitud incorrecta', errors?: any[]) {
    super(message, 400, errors);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

// Error 401 - Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// Error 403 - Forbidden
export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// Error 404 - Not Found
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// Error 409 - Conflict
export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// Error 422 - Unprocessable Entity
export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación', errors?: any[]) {
    super(message, 422, errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Error 500 - Internal Server Error
export class InternalServerError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

// Error 503 - Service Unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Servicio no disponible') {
    super(message, 503);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}
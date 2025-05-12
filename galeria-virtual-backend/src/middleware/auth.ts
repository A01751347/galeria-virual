import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  rol: string;
}

// Extender Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        email: string;
        rol: string;
        nombre: string;
        apellidos: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso no autorizado. Token no proporcionado' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'mi_secreto_super_seguro_para_jwt'
    ) as JwtPayload;
    
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
      nombre: decoded.nombre || '',
      apellidos: decoded.apellidos || ''
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso no autorizado. Token inválido' 
    });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso prohibido. Se requieren permisos de administrador' 
    });
  }
  
  next();
};

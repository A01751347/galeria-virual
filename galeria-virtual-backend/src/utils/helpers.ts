// src/utils/helpers.ts
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Genera un identificador único
 * @returns string - Identificador UUID v4
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Genera un código único aleatorio alfanumérico
 * @param length Longitud del código (default: 8)
 * @returns string - Código aleatorio
 */
export const generateRandomCode = (length: number = 8): string => {
  // Caracteres a utilizar (alfanuméricos sin caracteres ambiguos)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  // Generar bytes aleatorios
  const randomBytes = crypto.randomBytes(length);
  
  // Convertir bytes a caracteres del conjunto definido
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    result += chars.charAt(randomIndex);
  }
  
  return result;
};

/**
 * Genera un slug a partir de un texto
 * @param text Texto a convertir en slug
 * @returns string - Slug generado
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')                // Normalizar caracteres diacríticos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Reemplazar espacios con guiones
    .replace(/[^\w-]+/g, '')        // Eliminar caracteres no word
    .replace(/--+/g, '-');          // Reemplazar múltiples guiones por uno solo
};

/**
 * Formatea fecha a string local
 * @param date Fecha a formatear
 * @returns string - Fecha formateada
 */
export const formatDate = (date: Date | string | number): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Formatea un precio a string con formato de moneda
 * @param amount Cantidad a formatear
 * @param currency Moneda (default: MXN)
 * @returns string - Precio formateado
 */
export const formatCurrency = (amount: number, currency: string = 'MXN'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Trunca un texto a la longitud especificada
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns string - Texto truncado
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
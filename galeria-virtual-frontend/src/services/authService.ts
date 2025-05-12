import api from './api';
import { LoginCredentials, Usuario, ApiResponse } from '../types';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = `${import.meta.env.VITE_STORAGE_PREFIX}token`;
const USER_KEY = `${import.meta.env.VITE_STORAGE_PREFIX}user`;

// Iniciar sesión
export const login = async (credentials: LoginCredentials): Promise<{ token: string; user: Usuario }> => {
  try {
    const response = await api.post<ApiResponse<{ token: string; user: Usuario }>>('/auth/login', credentials);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al iniciar sesión');
    }
    
    const { token, user } = response.data.data;
    
    // Guardar token y usuario en localStorage
    setToken(token);
    setUser(user);
    
    return { token, user };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Registrar nuevo usuario
export const register = async (userData: Omit<Usuario, 'id' | 'rol' | 'fecha_creacion' | 'fecha_actualizacion' | 'ultimo_acceso'>): Promise<Usuario> => {
  try {
    const response = await api.post<ApiResponse<Usuario>>('/auth/register', userData);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al registrar usuario');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Cerrar sesión
export const logout = (): void => {
  removeToken();
  removeUser();
};

// Verificar autenticación
export const isAuthenticated = (): boolean => {
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded: any = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    
    // Verificar si el token no ha expirado
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

// Obtener usuario actual
export const getCurrentUser = (): Usuario | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Guardar token en localStorage
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Obtener token de localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Eliminar token de localStorage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Guardar usuario en localStorage
export const setUser = (user: Usuario): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Eliminar usuario de localStorage
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

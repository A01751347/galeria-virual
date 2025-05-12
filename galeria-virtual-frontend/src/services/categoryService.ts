import api from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },
  
  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },
  
  // Obtener información del usuario autenticado
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
  
  // Cerrar sesión (eliminar token local)
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  // Comprobar si hay un token almacenado
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  },
  
  // Guardar token en localStorage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },
  
  // Obtener token desde localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

export default authService;
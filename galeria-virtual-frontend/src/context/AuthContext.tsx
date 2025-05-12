import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/auth';
import authService from '../services/authService';

// Crear contexto con valor inicial
const AuthContext = createContext<AuthState | null>(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Props para el proveedor de contexto
interface AuthProviderProps {
  children: ReactNode;
}

// Componente proveedor de contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(authService.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar usuario al iniciar o cambiar token
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
        setIsAuthenticated(false);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Guardar token en localStorage
      authService.setToken(response.token);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrarse
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Guardar token en localStorage
      authService.setToken(response.token);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al registrarse');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Valor del contexto
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
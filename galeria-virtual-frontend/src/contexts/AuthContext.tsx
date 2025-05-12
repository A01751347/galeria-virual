import React, { createContext, useReducer, useEffect } from 'react';
import { AuthState, Usuario, LoginCredentials } from '../types';
import { login, logout, register, isAuthenticated, getCurrentUser, getToken } from '../services/authService';

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null
};

// Tipos de acciones
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: Usuario; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'REGISTER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, error: null };
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Crear contexto
interface AuthContextProps {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<Usuario, 'id' | 'rol' | 'fecha_creacion' | 'fecha_actualizacion' | 'ultimo_acceso'>) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  state: initialState,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  clearError: () => {}
});

// Proveedor de contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        const token = getToken();
        
        if (user && token) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token }
          });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };
    
    checkAuth();
  }, []);

  // Función para iniciar sesión
  const handleLogin = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const { user, token } = await login(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.message || 'Error al iniciar sesión'
      });
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Función para registrar
  const handleRegister = async (userData: Omit<Usuario, 'id' | 'rol' | 'fecha_creacion' | 'fecha_actualizacion' | 'ultimo_acceso'>) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    
    try {
      await register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error: any) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.response?.data?.message || 'Error al registrar usuario'
      });
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

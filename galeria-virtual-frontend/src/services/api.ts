import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, removeToken } from './authService';

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación a las solicitudes
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Si el error es 401 (No autorizado), limpiar token y redirigir al login
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// src/services/obraService.ts
import api from './api';
import { Obra, ApiResponse } from '../types';

// Obtener todas las obras
export const getObras = async (soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    const response = await api.get<ApiResponse<Obra[]>>(`/obras?disponibles=${soloDisponibles}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener obras:', error);
    throw error;
  }
};

// Obtener obras destacadas
export const getObrasDestacadas = async (): Promise<Obra[]> => {
  try {
    const response = await api.get<ApiResponse<Obra[]>>('/obras/destacadas');
    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener obras destacadas:', error);
    throw error;
  }
};

// Buscar obras
export const buscarObras = async (termino: string, soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    const response = await api.get<ApiResponse<Obra[]>>(`/obras/buscar?termino=${termino}&disponibles=${soloDisponibles}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error al buscar obras:', error);
    throw error;
  }
};

// Obtener obras por categoría
export const getObrasPorCategoria = async (categoriaId: number, soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    const response = await api.get<ApiResponse<Obra[]>>(`/obras/categoria/${categoriaId}?disponibles=${soloDisponibles}`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error al obtener obras de categoría ${categoriaId}:`, error);
    throw error;
  }
};

// Obtener obras por artista
export const getObrasPorArtista = async (artistaId: number, soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    const response = await api.get<ApiResponse<Obra[]>>(`/obras/artista/${artistaId}?disponibles=${soloDisponibles}`);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error al obtener obras del artista ${artistaId}:`, error);
    throw error;
  }
};

// Obtener detalle de una obra por ID
export const getDetalleObra = async (obraId: number | string): Promise<Obra> => {
  try {
    const response = await api.get<ApiResponse<Obra>>(`/obras/${obraId}`);
    if (!response.data.data) {
      throw new Error('Obra no encontrada');
    }
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener detalle de obra ${obraId}:`, error);
    throw error;
  }
};

// Obtener obra por código QR
export const getObraPorQR = async (codigoQR: string): Promise<Obra> => {
  try {
    const response = await api.get<ApiResponse<Obra>>(`/obras/${codigoQR}?tipo=qr`);
    if (!response.data.data) {
      throw new Error('Obra no encontrada');
    }
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener obra por QR ${codigoQR}:`, error);
    throw error;
  }
};

// Crear una nueva obra (requiere autenticación)
export const crearObra = async (obraData: FormData): Promise<Obra> => {
  try {
    const response = await api.post<ApiResponse<Obra>>('/obras', obraData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data as Obra;
  } catch (error) {
    console.error('Error al crear obra:', error);
    throw error;
  }
};

// Actualizar una obra (requiere autenticación)
export const actualizarObra = async (obraId: number, obraData: FormData): Promise<Obra> => {
  try {
    const response = await api.put<ApiResponse<Obra>>(`/obras/${obraId}`, obraData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data as Obra;
  } catch (error) {
    console.error(`Error al actualizar obra ${obraId}:`, error);
    throw error;
  }
};

// Actualizar estado de una obra (disponible, destacado) (requiere autenticación)
export const actualizarEstadoObra = async (obraId: number, disponible?: boolean, destacado?: boolean): Promise<void> => {
  try {
    await api.patch(`/obras/${obraId}/estado`, { disponible, destacado });
  } catch (error) {
    console.error(`Error al actualizar estado de obra ${obraId}:`, error);
    throw error;
  }
};

// Eliminar una obra (requiere autenticación)
export const eliminarObra = async (obraId: number): Promise<void> => {
  try {
    await api.delete(`/obras/${obraId}`);
  } catch (error) {
    console.error(`Error al eliminar obra ${obraId}:`, error);
    throw error;
  }
};

import api from '../api/apiClient';
import { logWithColor } from '../utils/debugHelper';
import { AxiosError } from 'axios';

type EntityType = 'obras' | 'categorias' | 'artistas' | 'tecnicas';
type EntityData = Record<string, any>;

export const updateEntity = async (
  entityType: EntityType,
  id: string | number,
  data: EntityData,
  hasFile = false
): Promise<any> => {
  logWithColor('info', `Iniciando actualización de ${entityType} con ID: ${id}`);
  logWithColor('debug', 'Datos a enviar:', data);

  try {
    let response;

    if (hasFile) {
      logWithColor('info', `La actualización incluye archivos - usando FormData`);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          logWithColor('debug', `Añadiendo archivo: ${key}`, value.name);
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          logWithColor('debug', `Añadiendo campo: ${key}=${value}`);
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      response = await api.put(`/${entityType}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await api.put(`/${entityType}/${id}`, data);
    }

    logWithColor('success', `${entityType} actualizado correctamente:`, response.data);
    return response.data;
  } catch (error: unknown) {
    logWithColor('error', `Error al actualizar ${entityType}:`, error);

    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      const { status, data: errorData } = axiosError.response;
      logWithColor('error', `Respuesta del servidor (${status}):`, errorData);

      switch (status) {
        case 400:
          logWithColor('warning', 'Error de validación - Revisa los datos enviados');
          break;
        case 401:
          logWithColor('warning', 'No autorizado - Verifica que estás logueado como admin');
          break;
        case 403:
          logWithColor('warning', 'Permiso denegado - No tienes permisos suficientes');
          break;
        case 404:
          logWithColor('warning', `${entityType} con ID ${id} no encontrado`);
          break;
        case 500:
          logWithColor('error', 'Error interno del servidor - Revisa los logs del backend');
          break;
        default:
          logWithColor('warning', 'Error no manejado');
      }
    }

    throw error;
  }
};

// Funciones específicas
export const updateArtwork = async (
  id: string | number,
  data: EntityData,
  hasFile = false
): Promise<any> => updateEntity('obras', id, data, hasFile);

export const updateCategory = async (
  id: string | number,
  data: EntityData
): Promise<any> => updateEntity('categorias', id, data);

export const updateArtist = async (
  id: string | number,
  data: EntityData,
  hasFile = false
): Promise<any> => updateEntity('artistas', id, data, hasFile);

export const updateTechnique = async (
  id: string | number,
  data: EntityData
): Promise<any> => updateEntity('tecnicas', id, data);

// Actualizar estado específico (disponible, destacado)
export const updateArtworkStatus = async (
  id: string | number,
  disponible: boolean,
  destacado: boolean
): Promise<any> => {
  logWithColor('info', `Actualizando estado de obra ID: ${id}`);
  logWithColor('debug', `Disponible: ${disponible}, Destacado: ${destacado}`);

  try {
    const response = await api.patch(`/obras/${id}/estado`, { disponible, destacado });
    logWithColor('success', 'Estado de obra actualizado correctamente:', response.data);
    return response.data;
  } catch (error) {
    logWithColor('error', 'Error al actualizar estado de obra:', error);
    throw error;
  }
};

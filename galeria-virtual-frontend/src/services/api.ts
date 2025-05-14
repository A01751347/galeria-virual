// Ejemplo de cómo configurar axios para incluir el token en todas las peticiones
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Añadir interceptor para incluir el token JWT en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(`${import.meta.env.VITE_STORAGE_PREFIX}token`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
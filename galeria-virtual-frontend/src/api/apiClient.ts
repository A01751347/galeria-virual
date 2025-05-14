import axios from 'axios';

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Añadir interceptor para peticiones (añadir token JWT)
api.interceptors.request.use(
  (config) => {
    console.log('🔍 Enviando petición a:', config.url);
    console.log('🔍 Método HTTP:', config.method?.toUpperCase());
    console.log('🔍 Datos enviados:', config.data);
    
    // Añadir token de autenticación si existe
    const token = localStorage.getItem(`${import.meta.env.VITE_STORAGE_PREFIX}token`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token JWT añadido a la petición');
    } else {
      console.warn('⚠️ No hay token JWT disponible');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error al enviar petición:', error);
    return Promise.reject(error);
  }
);

// Añadir interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta recibida de:', response.config.url);
    console.log('✅ Código de estado:', response.status);
    console.log('✅ Datos recibidos:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta:', error);
    
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('❌ Estado de error:', error.response.status);
      console.error('❌ Datos de error:', error.response.data);
      
      // Si es error de autenticación, redirigir a login
      if (error.response.status === 401) {
        console.warn('🔒 Sesión expirada o no autorizada');
        localStorage.removeItem(`${import.meta.env.VITE_STORAGE_PREFIX}token`);
        localStorage.removeItem(`${import.meta.env.VITE_STORAGE_PREFIX}user`);
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      console.error('❌ No se recibió respuesta del servidor:', error.request);
    } else {
      // Error al configurar la petición
      console.error('❌ Error al configurar petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
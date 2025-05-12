export interface Obra {
  id?: number;
  titulo: string;
  id_artista: number;
  id_categoria: number;
  id_tecnica: number;
  anio_creacion?: number;
  dimensiones?: string;
  precio: number;
  descripcion: string;
  historia?: string;
  disponible: boolean;
  destacado: boolean;
  url_imagen_principal: string;
  codigo_qr: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activo: boolean;
  
  // Campos adicionales que pueden venir de la API
  nombre_artista?: string;
  apellidos_artista?: string;
  biografia_artista?: string;
  nombre_categoria?: string;
  nombre_tecnica?: string;
  total_visitas?: number;
  imagenes?: ImagenObra[];
}

export interface ImagenObra {
  id?: number;
  id_obra: number;
  url_imagen: string;
  es_principal: boolean;
  titulo?: string;
  descripcion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activo: boolean;
}

export interface Artista {
  id?: number;
  nombre: string;
  apellidos: string;
  biografia?: string;
  email?: string;
  telefono?: string;
  sitio_web?: string;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activo: boolean;
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activo: boolean;
}

export interface Tecnica {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activo: boolean;
}

export interface Consulta {
  id?: number;
  id_obra: number;
  id_usuario?: number;
  nombre?: string;
  email: string;
  telefono?: string;
  mensaje: string;
  es_oferta: boolean;
  monto_oferta?: number;
  estado: 'pendiente' | 'respondida' | 'aceptada' | 'rechazada';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activo: boolean;
  
  // Campos adicionales
  titulo_obra?: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  contrasena?: string;
  telefono?: string;
  rol: 'admin' | 'cliente';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  ultimo_acceso?: string;
  activo: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}
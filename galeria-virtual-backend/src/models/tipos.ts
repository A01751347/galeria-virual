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
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  activo: boolean;
}

export interface ObraDetalle extends Obra {
  nombre_artista: string;
  apellidos_artista: string;
  biografia_artista?: string;
  nombre_categoria: string;
  nombre_tecnica: string;
  total_visitas?: number;
  imagenes?: ImagenObra[];
}

export interface Artista {
  id?: number;
  nombre: string;
  apellidos: string;
  biografia?: string;
  email?: string;
  telefono?: string;
  sitio_web?: string;
  fecha_nacimiento?: Date;
  nacionalidad?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  url_imagen?: string; 
  activo: boolean;
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  activo: boolean;
}

export interface Tecnica {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  activo: boolean;
}

export interface ImagenObra {
  id?: number;
  id_obra: number;
  url_imagen: string;
  es_principal: boolean;
  titulo?: string;
  descripcion?: string;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
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
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  activo: boolean;
}

export interface Venta {
  id?: number;
  id_obra: number;
  id_usuario?: number;
  nombre_comprador?: string;
  email_comprador: string;
  telefono_comprador?: string;
  precio_venta: number;
  comision: number;
  metodo_pago?: string;
  referencia_pago?: string;
  estado: 'pendiente' | 'pagado' | 'entregado' | 'cancelado';
  notas?: string;
  fecha_venta?: Date;
  fecha_actualizacion?: Date;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  contrasena: string;
  telefono?: string;
  rol: 'admin' | 'cliente';
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  ultimo_acceso?: Date;
  activo: boolean;
}

export interface Sesion {
  id: string;
  id_usuario: number;
  datos: Record<string, any>;
  ip_usuario?: string;
  user_agent?: string;
  fecha_creacion?: Date;
  fecha_expiracion: Date;
}

export interface Favorito {
  id?: number;
  id_usuario: number;
  id_obra: number;
  fecha_creacion?: Date;
}

export interface Estadisticas {
  total_obras: number;
  obras_disponibles: number;
  obras_vendidas: number;
  total_consultas: number;
  total_ofertas: number;
  total_clientes: number;
  ingresos_totales: number;
  comisiones_totales: number;
}

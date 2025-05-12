// src/utils/dataAdapter.ts

import { Artwork, ArtworkImage } from '../types/artwork';
import { Artist } from '../types/artist';
import { Category, Technique } from '../types/category';

// Adaptador para transformar datos de obras de arte
export function adaptArtwork(backendArtwork: any): Artwork {
  return {
    id: backendArtwork.id,
    title: backendArtwork.titulo,
    artist_id: backendArtwork.id_artista,
    category_id: backendArtwork.id_categoria,
    technique_id: backendArtwork.id_tecnica,
    year_created: backendArtwork.anio_creacion,
    dimensions: backendArtwork.dimensiones,
    price: backendArtwork.precio,
    description: backendArtwork.descripcion,
    story: backendArtwork.historia,
    available: backendArtwork.disponible,
    featured: backendArtwork.destacado,
    main_image_url: backendArtwork.url_imagen_principal,
    qr_code: backendArtwork.codigo_qr,
    created_at: backendArtwork.fecha_creacion,
    updated_at: backendArtwork.fecha_actualizacion,
    
    // Adaptar relaciones si existen
    artist: backendArtwork.nombre_artista ? {
      id: backendArtwork.id_artista,
      name: backendArtwork.nombre_artista,
      last_name: backendArtwork.apellidos_artista,
      biography: backendArtwork.biografia_artista
    } : undefined,
    
    category: backendArtwork.nombre_categoria ? {
      id: backendArtwork.id_categoria,
      name: backendArtwork.nombre_categoria
    } : undefined,
    
    technique: backendArtwork.nombre_tecnica ? {
      id: backendArtwork.id_tecnica,
      name: backendArtwork.nombre_tecnica
    } : undefined,
    
    // Adaptar imágenes adicionales
    additional_images: backendArtwork.imagenes ? backendArtwork.imagenes.map(adaptArtworkImage) : undefined,
    
    visits_count: backendArtwork.total_visitas
  };
}

// Adaptar imagen de obra
function adaptArtworkImage(backendImage: any): ArtworkImage {
  return {
    id: backendImage.id,
    artwork_id: backendImage.id_obra,
    image_url: backendImage.url_imagen,
    is_main: backendImage.es_principal,
    title: backendImage.titulo,
    description: backendImage.descripcion,
    created_at: backendImage.fecha_creacion,
    updated_at: backendImage.fecha_actualizacion
  };
}

// Adaptador para transformar datos de artistas
export function adaptArtist(backendArtist: any): Artist {
  return {
    id: backendArtist.id,
    name: backendArtist.nombre,
    last_name: backendArtist.apellidos,
    biography: backendArtist.biografia,
    email: backendArtist.email,
    phone: backendArtist.telefono,
    website: backendArtist.sitio_web,
    birth_date: backendArtist.fecha_nacimiento,
    nationality: backendArtist.nacionalidad,
    image_url: backendArtist.url_imagen,
    created_at: backendArtist.fecha_creacion,
    updated_at: backendArtist.fecha_actualizacion,
    active: backendArtist.activo,
    
    // Campos calculados
    full_name: `${backendArtist.nombre} ${backendArtist.apellidos}`,
    artworks_count: backendArtist.obras_count
  };
}

// Adaptador para transformar datos de categorías
export function adaptCategory(backendCategory: any): Category {
  return {
    id: backendCategory.id,
    name: backendCategory.nombre,
    description: backendCategory.descripcion,
    created_at: backendCategory.fecha_creacion,
    updated_at: backendCategory.fecha_actualizacion,
    active: backendCategory.activo,
    
    // Campos calculados
    artworks_count: backendCategory.obras_count
  };
}

// Adaptador para transformar datos de técnicas
export function adaptTechnique(backendTechnique: any): Technique {
  return {
    id: backendTechnique.id,
    name: backendTechnique.nombre,
    description: backendTechnique.descripcion,
    created_at: backendTechnique.fecha_creacion,
    updated_at: backendTechnique.fecha_actualizacion,
    active: backendTechnique.activo
  };
}
import api from './api';
import { Artwork, ArtworkDetailResponse, ArtworkFilters } from '../types/artwork';
import { adaptArtwork } from '../utils/dataAdapter';


const mapSortParam = (sortBy: string): string => {
  const sortMap: Record<string, string> = {
    'newest': 'fecha_desc',
    'oldest': 'fecha_asc',
    'price_asc': 'precio_asc',
    'price_desc': 'precio_desc',
    'title_asc': 'titulo_asc',
    'title_desc': 'titulo_desc'
  };
  return sortMap[sortBy] || 'relevancia';
};


// Función para adaptar los filtros del frontend al formato esperado por la API
const adaptFiltersToAPI = (filters?: ArtworkFilters): Record<string, any> => {
  if (!filters) return {};
  
  // Mapeo directo de nombres de parámetros
  return {
    id_categoria: filters.category_id,
    id_artista: filters.artist_id,
    id_tecnica: filters.technique_id,
    precio_min: filters.min_price,
    precio_max: filters.max_price,
    anio_desde: filters.year_from,
    anio_hasta: filters.year_to,
    disponibles: filters.available_only === true ? true : undefined,
    termino: filters.search_term,
    ordenar: filters.sort_by ? mapSortParam(filters.sort_by) : undefined
  };
};

// Función para obtener imágenes realistas de obras (fallback)
const getRealisticArtworkImages = () => {
  return [
    'https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg',
    'https://images.metmuseum.org/CRDImages/ep/original/DP-974-001.jpg',
    'https://images.metmuseum.org/CRDImages/ep/original/DT1502.jpg',
    'https://images.metmuseum.org/CRDImages/ep/original/DT1947.jpg',
    'https://media.getty.edu/museum/images/web/enlarge/00094701.jpg',
    'https://media.getty.edu/museum/images/web/enlarge/00101801.jpg',
    'https://media.nga.gov/iiif/public/objects/5/0/6/5/8/50658-primary-0-nativeres.ptif/full/!740,560/0/default.jpg',
    'https://media.nga.gov/iiif/public/objects/6/1/2/5/9/61259-primary-0-nativeres.ptif/full/!740,560/0/default.jpg',
    'https://images.metmuseum.org/CRDImages/gr/original/DP278491.jpg',
    'https://images.metmuseum.org/CRDImages/eg/original/DT11742.jpg',
    'https://media.getty.edu/museum/images/web/enlarge/00875301.jpg',
    'https://images.metmuseum.org/CRDImages/ph/original/DP143254.jpg',
    'https://images.metmuseum.org/CRDImages/ph/original/DP332714.jpg',
  ];
};

const artworkService = {
  // Obtener todas las obras con filtros opcionales
  getArtworks: async (filters?: ArtworkFilters): Promise<Artwork[]> => {
    try {
      // Adaptar filtros al formato de la API
      const apiParams = adaptFiltersToAPI(filters);
      
      // Eliminar valores undefined para evitar parámetros vacíos
      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(([_, v]) => v !== undefined)
      );
      
      // Log para depuración
      console.log('Enviando solicitud con parámetros:', cleanParams);
      
      const response = await api.get('/obras', { params: cleanParams });
      
      if (!response.data || !response.data.data) {
        console.error('Respuesta inesperada de la API:', response);
        return [];
      }
      
      return response.data.data.map(adaptArtwork);
    } catch (error) {
      console.error('Error al obtener obras:', error);
      throw error;
    }
  },

  // Obtener obras destacadas
  getFeaturedArtworks: async (): Promise<Artwork[]> => {
    try {
      const response = await api.get('/obras/destacadas');
      return response.data.data.map(adaptArtwork);
    } catch (error) {
      console.error('Error al obtener obras destacadas:', error);
      throw error;
    }
  },

  // Obtener obras por categoría
  getArtworksByCategory: async (categoryId: number, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    try {
      const response = await api.get(`/obras/categoria/${categoryId}`, {
        params: { disponibles: onlyAvailable }
      });
      return response.data.data.map(adaptArtwork);
    } catch (error) {
      console.error(`Error al obtener obras de categoría ${categoryId}:`, error);
      throw error;
    }
  },

  // Obtener obras por artista
  getArtworksByArtist: async (artistId: number, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    try {
      const response = await api.get(`/obras/artista/${artistId}`, {
        params: { disponibles: onlyAvailable }
      });
      return response.data.data.map(adaptArtwork);
    } catch (error) {
      console.error(`Error al obtener obras del artista ${artistId}:`, error);
      throw error;
    }
  },

  // Buscar obras por término
  searchArtworks: async (term: string, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    try {
      const response = await api.get(`/obras/buscar`, {
        params: { termino: term, disponibles: onlyAvailable }
      });
      return response.data.data.map(adaptArtwork);
    } catch (error) {
      console.error(`Error al buscar obras con término "${term}":`, error);
      throw error;
    }
  },

  // Obtener detalle de una obra
  getArtworkDetail: async (id: number): Promise<ArtworkDetailResponse> => {
    try {
      const response = await api.get(`/obras/${id}`);
      
      // Verificar respuesta
      if (!response.data || !response.data.data) {
        throw new Error('Respuesta inesperada al obtener detalle de obra');
      }
      
      const artwork = adaptArtwork(response.data.data);
      const relatedArtworks = response.data.data.related_artworks
        ? response.data.data.related_artworks.map(adaptArtwork)
        : [];

      return {
        artwork,
        related_artworks: relatedArtworks
      };
    } catch (error) {
      console.error(`Error al obtener detalle de obra ${id}:`, error);
      throw error;
    }
  },

  // Obtener obra por código QR
  getArtworkByQR: async (qrCode: string): Promise<ArtworkDetailResponse> => {
    try {
      const response = await api.get(`/obras/${qrCode}`, {
        params: { tipo: 'qr' }
      });
      
      const artwork = adaptArtwork(response.data.data);
      const relatedArtworks = response.data.data.related_artworks
        ? response.data.data.related_artworks.map(adaptArtwork)
        : [];
        
      return {
        artwork,
        related_artworks: relatedArtworks
      };
    } catch (error) {
      console.error(`Error al obtener obra por QR ${qrCode}:`, error);
      throw error;
    }
  },

  // Crear una nueva obra
 // Dentro de artworkService:
createArtwork: async (formData: FormData): Promise<Artwork> => {
  // Si no se envió archivo 'imagen' ni url_imagen_principal, añadir fallback
  if (!formData.get('imagen') && !formData.get('url_imagen_principal')) {
    const imgs = getRealisticArtworkImages();
    const randomImg = imgs[Math.floor(Math.random() * imgs.length)];
    formData.append('url_imagen_principal', randomImg);
  }

  const response = await api.post('/obras', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Se asume que response.data.data contiene la nueva obra
  return adaptArtwork(response.data.data);
},


  // Actualizar una obra existente
// Actualizar una obra existente
updateArtwork: async (id: number, formData: FormData): Promise<Artwork> => {
  try {
    // Log para depurar el FormData
    
    const response = await api.put(`/obras/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return adaptArtwork(response.data.data);
  } catch (error) {
    console.error(`Error al actualizar obra ${id}:`, error);
    throw error;
  }
},

  // Actualizar el estado de disponibilidad y destacado de una obra
  updateArtworkStatus: async (id: number, disponible?: boolean, destacado?: boolean): Promise<boolean> => {
    try {
      const response = await api.patch(`/obras/${id}/estado`, { disponible, destacado });
      return response.data.success || false;
    } catch (error) {
      console.error(`Error al actualizar estado de obra ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una obra (soft delete)
  deleteArtwork: async (id: number): Promise<boolean> => {
    try {
      const response = await api.delete(`/obras/${id}`);
      return response.data.success || false;
    } catch (error) {
      console.error(`Error al eliminar obra ${id}:`, error);
      throw error;
    }
  }
};

export default artworkService;
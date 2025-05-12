import api from './api';
import { Artist, ArtistDetailResponse, ArtistFilters } from '../types/artist';

const artistService = {
  // Obtener todos los artistas con filtros opcionales
  getArtists: async (filters?: ArtistFilters): Promise<Artist[]> => {
    const response = await api.get('/artistas', { params: filters });
    return response.data.data;
  },
  
  // Obtener detalle de un artista
  getArtistDetail: async (id: number): Promise<ArtistDetailResponse> => {
    const response = await api.get(`/artistas/${id}`);
    const artist = response.data.data;
    
    // Obtener las obras del artista
    const artworksResponse = await api.get(`/obras/artista/${id}`);
    
    return {
      artist,
      artworks: artworksResponse.data.data
    };
  },
  
  // Crear un nuevo artista (requiere autenticación de admin)
  createArtist: async (artistData: FormData): Promise<Artist> => {
    const response = await api.post('/artistas', artistData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  
  // Actualizar un artista (requiere autenticación de admin)
  updateArtist: async (id: number, artistData: FormData): Promise<Artist> => {
    const response = await api.put(`/artistas/${id}`, artistData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  
  // Eliminar un artista (requiere autenticación de admin)
  deleteArtist: async (id: number): Promise<void> => {
    await api.delete(`/artistas/${id}`);
  },
};

export default artistService;
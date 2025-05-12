import api from './api';
import { Artwork, ArtworkDetailResponse, ArtworkFilters } from '../types/artwork';

const artworkService = {
  // Obtener todas las obras con filtros opcionales
  getArtworks: async (filters?: ArtworkFilters): Promise<Artwork[]> => {
    const response = await api.get('/obras', { params: filters });
    return response.data.data;
  },
  
  // Obtener obras destacadas
  getFeaturedArtworks: async (): Promise<Artwork[]> => {
    const response = await api.get('/obras/destacadas');
    return response.data.data;
  },
  
  // Obtener obras por categoría
  getArtworksByCategory: async (categoryId: number, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    const response = await api.get(`/obras/categoria/${categoryId}`, {
      params: { disponibles: onlyAvailable }
    });
    return response.data.data;
  },
  
  // Obtener obras por artista
  getArtworksByArtist: async (artistId: number, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    const response = await api.get(`/obras/artista/${artistId}`, {
      params: { disponibles: onlyAvailable }
    });
    return response.data.data;
  },
  
  // Buscar obras
  searchArtworks: async (term: string, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    const response = await api.get(`/obras/buscar`, {
      params: { termino: term, disponibles: onlyAvailable }
    });
    return response.data.data;
  },
  
  // Obtener detalle de una obra
  getArtworkDetail: async (id: number): Promise<ArtworkDetailResponse> => {
    const response = await api.get(`/obras/${id}`);
    return response.data.data;
  },
  
  // Obtener detalle de una obra por código QR
  getArtworkByQR: async (qrCode: string): Promise<ArtworkDetailResponse> => {
    const response = await api.get(`/obras/${qrCode}`, {
      params: { tipo: 'qr' }
    });
    return response.data.data;
  },
  
  // Crear una nueva obra (requiere autenticación)
  createArtwork: async (artworkData: FormData): Promise<Artwork> => {
    const response = await api.post('/obras', artworkData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  
  // Actualizar una obra (requiere autenticación)
  updateArtwork: async (id: number, artworkData: FormData): Promise<Artwork> => {
    const response = await api.put(`/obras/${id}`, artworkData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
  
  // Actualizar el estado de una obra (disponible, destacado)
  updateArtworkStatus: async (id: number, disponible?: boolean, destacado?: boolean): Promise<void> => {
    await api.patch(`/obras/${id}/estado`, { disponible, destacado });
  },
  
  // Eliminar una obra (requiere autenticación)
  deleteArtwork: async (id: number): Promise<void> => {
    await api.delete(`/obras/${id}`);
  },
};

export default artworkService;
// src/services/artworkService.ts
import api from './api';
import { Artwork, ArtworkDetailResponse, ArtworkFilters } from '../types/artwork';
import { adaptArtwork } from '../utils/dataAdapter';

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
  getArtworks: async (filters?: ArtworkFilters): Promise<Artwork[]> => {
    const response = await api.get('/obras', { params: filters });
    return response.data.data.map(adaptArtwork);
  },

  getFeaturedArtworks: async (): Promise<Artwork[]> => {
    const response = await api.get('/obras/destacadas');
    return response.data.data.map(adaptArtwork);
  },

  getArtworksByCategory: async (categoryId: number, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    const response = await api.get(`/obras/categoria/${categoryId}`, {
      params: { disponibles: onlyAvailable }
    });
    return response.data.data.map(adaptArtwork);
  },

  getArtworksByArtist: async (artistId: number, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    const response = await api.get(`/obras/artista/${artistId}`, {
      params: { disponibles: onlyAvailable }
    });
    return response.data.data.map(adaptArtwork);
  },

  searchArtworks: async (term: string, onlyAvailable: boolean = false): Promise<Artwork[]> => {
    const response = await api.get(`/obras/buscar`, {
      params: { termino: term, disponibles: onlyAvailable }
    });
    return response.data.data.map(adaptArtwork);
  },

  getArtworkDetail: async (id: number): Promise<ArtworkDetailResponse> => {
    const response = await api.get(`/obras/${id}`);
    const artwork = adaptArtwork(response.data.data);
    const relatedArtworks = response.data.data.related_artworks
      ? response.data.data.related_artworks.map(adaptArtwork)
      : undefined;

    return {
      artwork,
      related_artworks: relatedArtworks
    };
  },

  getArtworkByQR: async (qrCode: string): Promise<ArtworkDetailResponse> => {
    const response = await api.get(`/obras/${qrCode}`, {
      params: { tipo: 'qr' }
    });
    return response.data.data;
  },

  createArtwork: async (artworkData: FormData): Promise<Artwork> => {
    if (!artworkData.get('imagen') && !artworkData.get('url_imagen_principal')) {
      const realisticImages = getRealisticArtworkImages();
      const randomImage = realisticImages[Math.floor(Math.random() * realisticImages.length)];
      artworkData.append('url_imagen_principal', randomImage);
    }

    const response = await api.post('/obras', artworkData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return adaptArtwork(response.data.data);
  },

  updateArtwork: async (id: number, artworkData: FormData): Promise<Artwork> => {
    const response = await api.put(`/obras/${id}`, artworkData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  updateArtworkStatus: async (id: number, disponible?: boolean, destacado?: boolean): Promise<void> => {
    await api.patch(`/obras/${id}/estado`, { disponible, destacado });
  },

  deleteArtwork: async (id: number): Promise<void> => {
    await api.delete(`/obras/${id}`);
  }
};

export default artworkService;

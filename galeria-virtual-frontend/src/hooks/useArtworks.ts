import { useQuery } from 'react-query';
import artworkService from '../services/artworkService';
import { ArtworkFilters, ArtworkQuery } from '../types/artwork';

// Hook para obtener todas las obras con filtros opcionales
export function useArtworks(filters?: ArtworkFilters): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['artworks', filters],
    () => artworkService.getArtworks(filters),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener obras destacadas
export function useFeaturedArtworks(): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    'featuredArtworks',
    artworkService.getFeaturedArtworks,
    {
      staleTime: 1000 * 60 * 15, // 15 minutos
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener obras por categoría
export function useArtworksByCategory(categoryId: number, onlyAvailable: boolean = false): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['artworksByCategory', categoryId, onlyAvailable],
    () => artworkService.getArtworksByCategory(categoryId, onlyAvailable),
    {
      enabled: !!categoryId,
      keepPreviousData: true,
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener obras por artista
export function useArtworksByArtist(artistId: number, onlyAvailable: boolean = false): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['artworksByArtist', artistId, onlyAvailable],
    () => artworkService.getArtworksByArtist(artistId, onlyAvailable),
    {
      enabled: !!artistId,
      keepPreviousData: true,
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para buscar obras
export function useSearchArtworks(term: string, onlyAvailable: boolean = false): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['searchArtworks', term, onlyAvailable],
    () => artworkService.searchArtworks(term, onlyAvailable),
    {
      enabled: term.length > 2, // Solo buscar si hay al menos 3 caracteres
      keepPreviousData: true,
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener detalle de una obra
export function useArtworkDetail(id: number) {
  return useQuery(
    ['artworkDetail', id],
    () => artworkService.getArtworkDetail(id),
    {
      enabled: !!id,
    }
  );
}

// Hook para obtener detalle de una obra por código QR
export function useArtworkByQR(qrCode: string) {
  return useQuery(
    ['artworkByQR', qrCode],
    () => artworkService.getArtworkByQR(qrCode),
    {
      enabled: !!qrCode,
    }
  );
}
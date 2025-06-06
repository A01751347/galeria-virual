import { useQuery } from 'react-query';
import artworkService from '../services/artworkService';
import { ArtworkFilters, ArtworkQuery } from '../types/artwork';
import { useEffect } from 'react';

// Hook para obtener todas las obras con filtros opcionales
export function useArtworks(filters?: ArtworkFilters): ArtworkQuery {
  // React Query ya detecta cambios en 'filters' y hace refetch automáticamente
  const { data, isLoading, error, refetch } = useQuery(
    ['artworks', filters], 
    () => artworkService.getArtworks(filters),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1, // Reducir a 1 intento para evitar demasiadas solicitudes fallidas
      refetchOnWindowFocus: false,
    }
  );
  
  // Elimina el useEffect que estaba causando el bucle de llamadas
  
  return { data, isLoading, error, refetch };
}
// Hook para obtener obras destacadas
export function useFeaturedArtworks(): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    'featuredArtworks',
    artworkService.getFeaturedArtworks,
    {
      staleTime: 1000 * 60 * 15, // 15 minutos
      refetchOnWindowFocus: false,
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener obras por categoría
export function useArtworksByCategory(
  categoryId: number, 
  onlyAvailable: boolean = false
): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['artworksByCategory', categoryId, onlyAvailable],
    () => artworkService.getArtworksByCategory(categoryId, onlyAvailable),
    {
      enabled: !!categoryId, // Solo ejecutar si categoryId existe
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener obras por artista
export function useArtworksByArtist(
  artistId: number, 
  onlyAvailable: boolean = false
): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['artworksByArtist', artistId, onlyAvailable],
    () => artworkService.getArtworksByArtist(artistId, onlyAvailable),
    {
      enabled: !!artistId, // Solo ejecutar si artistId existe
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para buscar obras
export function useSearchArtworks(
  term: string, 
  onlyAvailable: boolean = false
): ArtworkQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['searchArtworks', term, onlyAvailable],
    () => artworkService.searchArtworks(term, onlyAvailable),
    {
      enabled: term.length > 2, // Solo buscar si hay al menos 3 caracteres
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
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
      enabled: !!id, // Solo ejecutar si id existe
      staleTime: 1000 * 60 * 10, // 10 minutos
      refetchOnWindowFocus: false,
    }
  );
}

// Hook para obtener detalle de una obra por código QR
export function useArtworkByQR(qrCode: string) {
  return useQuery(
    ['artworkByQR', qrCode],
    () => artworkService.getArtworkByQR(qrCode),
    {
      enabled: !!qrCode, // Solo ejecutar si qrCode existe
      staleTime: 1000 * 60 * 10, // 10 minutos
      refetchOnWindowFocus: false,
    }
  );
}

export function useArtworkDelete(id: number) {
  return useQuery(
    ['DeleteArtwork', id],
    () => artworkService.deleteArtwork(id),
    {
      enabled: !!id, // Solo ejecutar si qrCode existe
      staleTime: 1000 * 60 * 10, // 10 minutos
      refetchOnWindowFocus: false,
    }
  );
}

export default {
  useArtworks,
  useFeaturedArtworks,
  useArtworksByCategory,
  useArtworksByArtist,
  useSearchArtworks,
  useArtworkDetail,
  useArtworkByQR,
  useArtworkDelete
};
import { useQuery } from 'react-query';
import artistService from '../services/artistService';
import { Artist, ArtistFilters, ArtistQuery, ArtworkPreview } from '../types/artist';

// Hook para obtener todos los artistas
export function useArtists(filters?: ArtistFilters): ArtistQuery {
  const { data, isLoading, error, refetch } = useQuery(
    ['artists', filters],
    () => artistService.getArtists(filters),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 15, // 15 minutos
    }
  );
  
  return { data, isLoading, error, refetch };
}

export function useArtistDetail(id: number) {
  return useQuery<{artist: Artist, artworks: ArtworkPreview[]}, Error>(
    ['artistDetail', id],
    () => artistService.getArtistDetail(id),
    {
      enabled: !!id,
    }
  );
}
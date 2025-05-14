export interface Artist {
  id: number;
  name: string;
  last_name: string;
  biography?: string;
  email?: string;
  phone?: string;
  website?: string;
  birth_date?: string;
  nationality?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  
  // Campos calculados
  full_name?: string;
  artworks_count?: number;
}

export interface ArtworkPreview {
  id: number;
  title: string;
  main_image_url: string;
  price: number;
  available: boolean;
  year_created?: number;
}

export interface ArtistDetailResponse {
  artist: Artist;
  artworks: ArtworkPreview[];
}

export interface ArtistFilters {
  search_term?: string;
  nationality?: string;
  sort_by?: 'name_asc' | 'name_desc' | 'newest' | 'oldest' | 'artworks_count';
}

export interface ArtistQuery {
  data?: Artist[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
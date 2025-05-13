export interface Artwork {
  id: number;
  title: string;
  artist_id: number;
  category_id: number;
  technique_id: number;
  year_created?: number;
  dimensions?: string;
  price: number;
  description: string;
  story?: string;
  available: boolean;
  featured: boolean;
  main_image_url: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  artist?: Artist;
  category?: Category;
  technique?: Technique;
  additional_images?: ArtworkImage[];
  visits_count?: number;
}

export interface ArtworkImage {
  id: number;
  artwork_id: number;
  image_url: string;
  is_main: boolean;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ArtworkDetailResponse {
  artwork: Artwork;
  related_artworks?: Artwork[];
}

export interface ArtworkFilters {
  category_id?: number;
  artist_id?: number;
  technique_id?: number;
  min_price?: number;
  max_price?: number;
  year_from?: number;
  year_to?: number;
  available_only?: boolean;
  search_term?: string;
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
}
export interface ArtworkQuery {
  data?: Artwork[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

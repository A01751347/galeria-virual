export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  
  // Campos calculados
  artworks_count?: number;
  image_url?: string; // Imagen representativa de la categoría
}

export interface Technique {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface CategoryQuery {
  data?: Category[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export interface TechniqueQuery {
  data?: Technique[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
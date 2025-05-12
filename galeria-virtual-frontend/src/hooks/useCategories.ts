import { useQuery } from 'react-query';
import categoryService from '../services/categoryService';
import { CategoryQuery, TechniqueQuery } from '../types/category';

// Hook para obtener todas las categorías
export function useCategories(): CategoryQuery {
  const { data, isLoading, error, refetch } = useQuery(
    'categories',
    categoryService.getCategories,
    {
      staleTime: 1000 * 60 * 30, // 30 minutos
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener detalle de una categoría
export function useCategoryDetail(id: number) {
  return useQuery(
    ['categoryDetail', id],
    () => categoryService.getCategoryDetail(id),
    {
      enabled: !!id,
    }
  );
}

// Hook para obtener todas las técnicas
export function useTechniques(): TechniqueQuery {
  const { data, isLoading, error, refetch } = useQuery(
    'techniques',
    categoryService.getTechniques,
    {
      staleTime: 1000 * 60 * 30, // 30 minutos
    }
  );
  
  return { data, isLoading, error, refetch };
}

// Hook para obtener detalle de una técnica
export function useTechniqueDetail(id: number) {
  return useQuery(
    ['techniqueDetail', id],
    () => categoryService.getTechniqueDetail(id),
    {
      enabled: !!id,
    }
  );
}
import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import ArtworkFilter from '../components/artwork/ArtworkFilter';
import { useArtworks } from '../hooks/useArtworks';
import { ArtworkFilters } from '../types/artwork';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

const GalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Función para leer los filtros desde la URL
  const getFiltersFromURL = useCallback((): ArtworkFilters => {
    return {
      category_id: searchParams.get('categoria') ? parseInt(searchParams.get('categoria') as string) : undefined,
      artist_id: searchParams.get('artista') ? parseInt(searchParams.get('artista') as string) : undefined,
      technique_id: searchParams.get('tecnica') ? parseInt(searchParams.get('tecnica') as string) : undefined,
      min_price: searchParams.get('precio_min') ? parseInt(searchParams.get('precio_min') as string) : undefined,
      max_price: searchParams.get('precio_max') ? parseInt(searchParams.get('precio_max') as string) : undefined,
      year_from: searchParams.get('anio_desde') ? parseInt(searchParams.get('anio_desde') as string) : undefined,
      year_to: searchParams.get('anio_hasta') ? parseInt(searchParams.get('anio_hasta') as string) : undefined,
      available_only: searchParams.get('disponibles') === 'true',
      search_term: searchParams.get('buscar') || undefined,
      sort_by: (searchParams.get('ordenar') || undefined) as ArtworkFilters['sort_by'],
    };
  }, [searchParams]);
  
  // Estado para filtros
  const [filters, setFilters] = useState<ArtworkFilters>(getFiltersFromURL());
  
  // Estado para controlar visualización de filtros en móvil
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  
  // Obtener obras con filtros aplicados
  const { data: artworks, isLoading, error, refetch } = useArtworks(filters);
  
  // Manejar cambios en los filtros
  const handleFilterChange = useCallback((newFilters: ArtworkFilters) => {
    // Actualizar los filtros
    setFilters(newFilters);
    
    // Actualizar la URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'category_id':
            if (value) params.set('categoria', value.toString());
            break;
          case 'artist_id':
            if (value) params.set('artista', value.toString());
            break;
          case 'technique_id':
            if (value) params.set('tecnica', value.toString());
            break;
          case 'min_price':
            if (value) params.set('precio_min', value.toString());
            break;
          case 'max_price':
            if (value) params.set('precio_max', value.toString());
            break;
          case 'year_from':
            if (value) params.set('anio_desde', value.toString());
            break;
          case 'year_to':
            if (value) params.set('anio_hasta', value.toString());
            break;
          case 'available_only':
            if (value) params.set('disponibles', 'true');
            break;
          case 'search_term':
            if (value) params.set('buscar', value);
            break;
          case 'sort_by':
            if (value) params.set('ordenar', value);
            break;
        }
      }
    });
    
    setSearchParams(params);
  }, [setSearchParams]);
  
  // Resetear filtros
  const handleResetFilters = useCallback(() => {
    setFilters({});
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);
  
  // Toggle filtros en móvil
  const toggleMobileFilters = useCallback(() => {
    setIsMobileFilterVisible(prev => !prev);
  }, []);
  
  // Contar número de filtros activos
  const activeFiltersCount = useMemo(() => 
    Object.values(filters).filter(value => value !== undefined).length,
    [filters]
  );

  return (
    <Layout>
      {/* Header de la galería */}
      <div className="bg-neutral-lightest py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Galería de Arte
          </h1>
          <p className="text-neutral-dark max-w-2xl">
            Explora nuestra colección de obras únicas de artistas talentosos. Utiliza los filtros para encontrar la obra perfecta para ti.
          </p>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Botón para mostrar/ocultar filtros en móvil */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleMobileFilters}
            className="w-full bg-white border border-neutral-light rounded-md p-3 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros - Versión móvil */}
          <motion.div
            className="md:hidden"
            initial={false}
            animate={{ height: isMobileFilterVisible ? 'auto' : 0, opacity: isMobileFilterVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="mb-6">
              <ArtworkFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </motion.div>
          
          {/* Filtros - Versión desktop */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ArtworkFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
          
          {/* Cuadrícula de obras */}
          <div className="flex-grow">
            {/* Información de resultados */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <p className="text-neutral-dark">
                  {isLoading
                    ? 'Cargando obras...'
                    : artworks?.length === 0
                    ? 'No se encontraron obras'
                    : `Mostrando ${artworks?.length} obras`}
                </p>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-xs"
                  >
                    Limpiar filtros
                  </Button>
                )}
                {/* Botón para forzar refetch */}
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => refetch()}
                  className="text-xs"
                >
                  Actualizar
                </Button>
              </div>
              
              {/* Selector de vista */}
              <div className="hidden md:flex gap-2">
                {/* Controles de vista */}
              </div>
            </div>
            
            {/* Mostrar obras */}
            <ArtworkGrid
              artworks={artworks || []}
              loading={isLoading}
              emptyMessage={
                activeFiltersCount > 0
                  ? 'No se encontraron obras con los filtros seleccionados'
                  : 'No hay obras disponibles'
              }
            />
            
            {/* Mensaje de error si existe */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                <p className="font-medium">Error al cargar las obras</p>
                <p className="text-sm">{(error as Error).message || 'Ocurrió un error al cargar las obras. Por favor, intenta nuevamente.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GalleryPage;
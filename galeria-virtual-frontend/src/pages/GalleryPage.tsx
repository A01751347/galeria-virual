import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  
  // Función memoizada para leer los filtros desde la URL
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
  
  // Estado para filtros - inicializado con los valores de la URL
  const [filters, setFilters] = useState<ArtworkFilters>(getFiltersFromURL());
  
  // Memoizar la representación JSON de los filtros para evitar re-renderizaciones innecesarias
  const filtersJSON = useMemo(() => JSON.stringify(filters), [filters]);
  
  // Estado para controlar visualización de filtros en móvil
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  
  // Obtener obras con filtros aplicados
  const { data: artworks, isLoading, error } = useArtworks(filters);
  
  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Solo añadir parámetros para filtros definidos
    if (filters.category_id) params.set('categoria', filters.category_id.toString());
    if (filters.artist_id) params.set('artista', filters.artist_id.toString());
    if (filters.technique_id) params.set('tecnica', filters.technique_id.toString());
    if (filters.min_price) params.set('precio_min', filters.min_price.toString());
    if (filters.max_price) params.set('precio_max', filters.max_price.toString());
    if (filters.year_from) params.set('anio_desde', filters.year_from.toString());
    if (filters.year_to) params.set('anio_hasta', filters.year_to.toString());
    if (filters.available_only) params.set('disponibles', 'true');
    if (filters.search_term) params.set('buscar', filters.search_term);
    if (filters.sort_by) params.set('ordenar', filters.sort_by);
    
    // Comparar parámetros actuales con los nuevos para evitar actualizaciones innecesarias
    const currentParamsStr = searchParams.toString();
    const newParamsStr = params.toString();
    
    if (currentParamsStr !== newParamsStr) {
      setSearchParams(params);
    }
  }, [filtersJSON, setSearchParams]);
  
  // Actualizar los filtros cuando cambia la URL externamente
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    const urlFiltersStr = JSON.stringify(urlFilters);
    
    // Solo actualizar si realmente cambiaron los filtros
    if (urlFiltersStr !== filtersJSON) {
      setFilters(urlFilters);
    }
  }, [searchParams, getFiltersFromURL, filtersJSON]);
  
  // Manejar cambios en los filtros
  const handleFilterChange = useCallback((newFilters: ArtworkFilters) => {
    setFilters(newFilters);
  }, []);
  
  // Resetear filtros
  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  // Toggle filtros en móvil
  const toggleMobileFilters = useCallback(() => {
    setIsMobileFilterVisible(prev => !prev);
  }, []);
  
  // Contar número de filtros activos
  const activeFiltersCount = useMemo(() => 
    Object.values(filters).filter(value => value !== undefined).length,
    [filtersJSON]
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
              </div>
              
              {/* Selector de vista (grid, lista) - podría implementarse en el futuro */}
              <div className="hidden md:flex gap-2">
                <button
                  className="p-2 rounded-md bg-white border border-neutral-light text-primary"
                  aria-label="Vista de cuadrícula"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-md bg-white border border-neutral-light"
                  aria-label="Vista de lista"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
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
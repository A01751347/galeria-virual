import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import ArtworkFilter from '../components/artwork/ArtworkFilter';
import { useArtworks } from '../hooks/useArtworks';
import { ArtworkFilters } from '../types/artwork';
import { motion } from 'framer-motion';

const GalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estado para filtros
  const [filters, setFilters] = useState<ArtworkFilters>({
    category_id: searchParams.get('categoria') ? parseInt(searchParams.get('categoria') as string) : undefined,
    artist_id: searchParams.get('artista') ? parseInt(searchParams.get('artista') as string) : undefined,
    technique_id: searchParams.get('tecnica') ? parseInt(searchParams.get('tecnica') as string) : undefined,
    min_price: searchParams.get('precio_min') ? parseInt(searchParams.get('precio_min') as string) : undefined,
    max_price: searchParams.get('precio_max') ? parseInt(searchParams.get('precio_max') as string) : undefined,
    available_only: searchParams.get('disponibles') === 'true',
    search_term: searchParams.get('buscar') || undefined,
    sort_by: (searchParams.get('ordenar') || undefined) as ArtworkFilters['sort_by'],
  });
  
  // Estado para controlar visualización de filtros en móvil
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  
  // Obtener obras con filtros aplicados
  const { data: artworks, isLoading, error } = useArtworks(filters);
  
  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category_id) params.set('categoria', filters.category_id.toString());
    if (filters.artist_id) params.set('artista', filters.artist_id.toString());
    if (filters.technique_id) params.set('tecnica', filters.technique_id.toString());
    if (filters.min_price) params.set('precio_min', filters.min_price.toString());
    if (filters.max_price) params.set('precio_max', filters.max_price.toString());
    if (filters.available_only) params.set('disponibles', 'true');
    if (filters.search_term) params.set('buscar', filters.search_term);
    if (filters.sort_by) params.set('ordenar', filters.sort_by);
    
    setSearchParams(params);
  }, [filters, setSearchParams]);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: ArtworkFilters) => {
    setFilters(newFilters);
  };
  
  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({});
  };
  
  // Toggle filtros en móvil
  const toggleMobileFilters = () => {
    setIsMobileFilterVisible(!isMobileFilterVisible);
  };

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
            {Object.keys(filters).length > 0 && (
              <span className="bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                {Object.keys(filters).length}
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
              <p className="text-neutral-dark">
                {isLoading
                  ? 'Cargando obras...'
                  : artworks?.length === 0
                  ? 'No se encontraron obras'
                  : `Mostrando ${artworks?.length} obras`}
              </p>
              
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
                Object.keys(filters).length > 0
                  ? 'No se encontraron obras con los filtros seleccionados'
                  : 'No hay obras disponibles'
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GalleryPage;
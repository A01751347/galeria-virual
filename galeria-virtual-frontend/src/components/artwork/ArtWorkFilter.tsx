import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtworkFilters } from '../../types/artwork';
import Button from '../common/Button';
import { useCategories, useTechniques } from '../../hooks/useCategories';
import { useArtists } from '../../hooks/useArtists';

interface ArtworkFilterProps {
  filters: ArtworkFilters;
  onChange: (newFilters: ArtworkFilters) => void;
  onReset: () => void;
  className?: string;
}

const ArtworkFilter: React.FC<ArtworkFilterProps> = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ArtworkFilters>(filters);
  
  // Cargar opciones para los filtros
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: techniques, isLoading: techniquesLoading } = useTechniques();
  const { data: artists, isLoading: artistsLoading } = useArtists();

  // Actualizar filtros locales cuando cambien los props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // Manejar cambios en los selectores
  const handleSelectChange = useCallback((
    e: React.ChangeEvent<HTMLSelectElement>,
    filterName: keyof ArtworkFilters
  ) => {
    const value = e.target.value;
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: value === '' ? undefined : parseInt(value),
    }));
  }, []);

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: keyof ArtworkFilters
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: e.target.checked,
    }));
  }, []);

  // Manejar cambios en el ordenamiento
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters(prev => ({
      ...prev,
      sort_by: e.target.value === '' ? undefined : e.target.value as ArtworkFilters['sort_by'],
    }));
  }, []);

  // Manejar cambios en campos numéricos
  const handleNumberChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>, 
    filterName: 'min_price' | 'max_price' | 'year_from' | 'year_to'
  ) => {
    const value = e.target.value;
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: value === '' ? undefined : parseInt(value),
    }));
  }, []);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    console.log("Aplicando filtros:", localFilters);
    onChange(localFilters);
    setMobileFiltersOpen(false);
  }, [localFilters, onChange]);

  // Restablecer filtros
  const resetFilters = useCallback(() => {
    setLocalFilters({});
    onReset();
    setMobileFiltersOpen(false);
  }, [onReset]);

  return (
    <div className={`bg-white rounded-lg shadow-card overflow-hidden ${className}`}>
      {/* Header móvil */}
      <div className="p-4 border-b border-neutral-light md:hidden">
        <button
          onClick={toggleMobileFilters}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium">Filtros</span>
          <div className="flex items-center">
            {Object.keys(filters).length > 0 && (
              <span className="bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
                {Object.keys(filters).length}
              </span>
            )}
            <svg
              className={`h-5 w-5 transform transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Contenido de filtros - Desktop siempre visible, móvil condicional */}
      <AnimatePresence>
        {(mobileFiltersOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-bold mb-4 hidden md:block">Filtros</h3>

              {/* Categoría */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Categoría</label>
                <select
                  className="w-full border border-neutral-light rounded p-2"
                  value={localFilters.category_id?.toString() || ''}
                  onChange={(e) => handleSelectChange(e, 'category_id')}
                  disabled={categoriesLoading}
                >
                  <option value="">Todas las categorías</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Artista */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Artista</label>
                <select
                  className="w-full border border-neutral-light rounded p-2"
                  value={localFilters.artist_id?.toString() || ''}
                  onChange={(e) => handleSelectChange(e, 'artist_id')}
                  disabled={artistsLoading}
                >
                  <option value="">Todos los artistas</option>
                  {artists?.map((artist) => (
                    <option key={artist.id} value={artist.id.toString()}>
                      {artist.name} {artist.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Técnica */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Técnica</label>
                <select
                  className="w-full border border-neutral-light rounded p-2"
                  value={localFilters.technique_id?.toString() || ''}
                  onChange={(e) => handleSelectChange(e, 'technique_id')}
                  disabled={techniquesLoading}
                >
                  <option value="">Todas las técnicas</option>
                  {techniques?.map((technique) => (
                    <option key={technique.id} value={technique.id.toString()}>
                      {technique.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rango de precio */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Precio</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    className="w-full border border-neutral-light rounded p-2"
                    value={localFilters.min_price || ''}
                    onChange={(e) => handleNumberChange(e, 'min_price')}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    className="w-full border border-neutral-light rounded p-2"
                    value={localFilters.max_price || ''}
                    onChange={(e) => handleNumberChange(e, 'max_price')}
                    min={localFilters.min_price || 0}
                  />
                </div>
              </div>

              {/* Rango de año */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Año de creación</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Desde"
                    className="w-full border border-neutral-light rounded p-2"
                    value={localFilters.year_from || ''}
                    onChange={(e) => handleNumberChange(e, 'year_from')}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                  <input
                    type="number"
                    placeholder="Hasta"
                    className="w-full border border-neutral-light rounded p-2"
                    value={localFilters.year_to || ''}
                    onChange={(e) => handleNumberChange(e, 'year_to')}
                    min={localFilters.year_from || 1000}
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              {/* Disponibilidad */}
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    id="available-only"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
                    checked={localFilters.available_only || false}
                    onChange={(e) => handleCheckboxChange(e, 'available_only')}
                  />
                  <label htmlFor="available-only" className="ml-2 block font-medium">
                    Solo disponibles
                  </label>
                </div>
              </div>

              {/* Ordenar por */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Ordenar por</label>
                <select
                  className="w-full border border-neutral-light rounded p-2"
                  value={localFilters.sort_by || ''}
                  onChange={handleSortChange}
                >
                  <option value="">Relevancia</option>
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                  <option value="title_asc">Título: A-Z</option>
                  <option value="title_desc">Título: Z-A</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={resetFilters}
                >
                  Restablecer
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={applyFilters}
                >
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ArtworkFilter);
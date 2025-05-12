import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { Artwork } from '../../types/artwork';

interface HeroProps {
  featuredArtworks: Artwork[];
  loading?: boolean;
}

const Hero: React.FC<HeroProps> = ({ featuredArtworks, loading = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Cambiar automáticamente entre slides cada 6 segundos
  useEffect(() => {
    if (featuredArtworks.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArtworks.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [featuredArtworks]);
  
  // Ir a slide anterior
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredArtworks.length - 1 : prev - 1
    );
  };
  
  // Ir a slide siguiente
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArtworks.length);
  };
  
  // Si está cargando o no hay obras, mostrar placeholder
  if (loading || featuredArtworks.length === 0) {
    return (
      <div className="relative w-full h-screen-80 bg-neutral-medium animate-pulse flex items-center justify-center">
        <div className="text-neutral-dark text-center">
          {loading ? 'Cargando...' : 'No hay obras destacadas para mostrar'}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen-80 overflow-hidden">
      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Siguiente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      
      {/* Slides */}
      <AnimatePresence mode="wait">
        {featuredArtworks.map((artwork, index) => (
          index === currentSlide && (
            <motion.div
              key={artwork.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Imagen de fondo */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${artwork.main_image_url})` }}
              />
              
              {/* Overlay para mejor legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
              
              {/* Contenido */}
              <div className="relative h-full flex flex-col justify-end">
                <div className="container mx-auto px-4 pb-20">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
                      {artwork.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl text-white mb-6">
                      {artwork.artist?.name} {artwork.artist?.last_name}
                    </h2>
                    <p className="text-neutral-lightest mb-8 line-clamp-3">
                      {artwork.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to={`/obra/${artwork.id}`}>
                        <Button variant="primary" size="lg">
                          Ver detalle
                        </Button>
                      </Link>
                      <Link to="/galeria">
                        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-neutral-darkest">
                          Explorar galería
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      
      {/* Indicadores de slide */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {featuredArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
            } transition-all duration-300`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
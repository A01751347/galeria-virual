import React from 'react';
import { motion } from 'framer-motion';
import { Artwork } from '../../types/artwork';
import ArtworkCard from './ArtWorkCard';

interface ArtworkGridProps {
  artworks: Artwork[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks,
  loading = false,
  emptyMessage = 'No se encontraron obras',
  className = '',
}) => {
  // Crea un array de placeholders para el estado de carga
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  // Variantes para animación de aparición
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {skeletonCards.map((index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-card">
            <div className="aspect-square bg-neutral-light animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-neutral-light rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-neutral-light rounded animate-pulse w-3/4"></div>
              <div className="mt-2 flex justify-between">
                <div className="h-4 bg-neutral-light rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-neutral-light rounded animate-pulse w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 bg-neutral-lightest rounded-lg">
        <p className="text-neutral-dark text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {artworks.map((artwork) => (
        <motion.div key={artwork.id} variants={itemVariants}>
          <ArtworkCard artwork={artwork} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ArtworkGrid;
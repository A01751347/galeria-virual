import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Artwork } from '../../types/artwork';
import ArtworkCard from '../artwork/ArtworkCard';
import Button from '../common/Button';

interface RecentArtworksProps {
  artworks: Artwork[];
  loading?: boolean;
}

const RecentArtworks: React.FC<RecentArtworksProps> = ({ artworks, loading = false }) => {
  // Variantes para animación
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

  // Si está cargando, mostrar placeholders
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-neutral-light rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-neutral-light rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-card">
              <div className="aspect-square bg-neutral-light animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-neutral-light rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-neutral-light rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Si no hay obras, no mostrar la sección
  if (artworks.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-heading font-bold mb-4 md:mb-0">
          Obras recientes
        </h2>
        <Link to="/galeria">
          <Button variant="outline">
            Ver todas las obras
          </Button>
        </Link>
      </div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {artworks.map((artwork) => (
          <motion.div key={artwork.id} variants={itemVariants}>
            <ArtworkCard artwork={artwork} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecentArtworks;
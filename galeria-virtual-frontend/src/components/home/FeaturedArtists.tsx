import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Artist } from '../../types/artist';
import Card from '../common/Card';

interface FeaturedArtistsProps {
  artists: Artist[];
  loading?: boolean;
}

const FeaturedArtists: React.FC<FeaturedArtistsProps> = ({ artists, loading = false }) => {
  // Variantes para animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      <div className="bg-neutral-lightest py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-8 bg-neutral-light rounded w-64 mx-auto animate-pulse mb-4"></div>
            <div className="h-4 bg-neutral-light rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-card">
                <div className="p-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-neutral-light animate-pulse mb-4"></div>
                  <div className="h-5 bg-neutral-light rounded animate-pulse w-32 mb-2"></div>
                  <div className="h-4 bg-neutral-light rounded animate-pulse w-48 mb-4"></div>
                  <div className="h-8 bg-neutral-light rounded animate-pulse w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si no hay artistas, no mostrar la sección
  if (artists.length === 0) {
    return null;
  }

  // Filtrar solo los primeros 3 artistas
  const displayArtists = artists.slice(0, 3);

  return (
    <div className="bg-neutral-lightest py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Artistas destacados
          </h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Conoce a los artistas talentosos detrás de nuestras obras más impresionantes
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayArtists.map((artist) => (
            <motion.div key={artist.id} variants={itemVariants}>
              <Card className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={artist.image_url || 'https://via.placeholder.com/200?text=Artist'}
                    alt={`${artist.name} ${artist.last_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  {artist.name} {artist.last_name}
                </h3>
                <p className="text-neutral-dark text-sm mb-6 line-clamp-3">
                  {artist.biography || 'Artista reconocido con una trayectoria destacada en el mundo del arte.'}
                </p>
                <Link 
                  to={`/artista/${artist.id}`}
                  className="text-primary font-medium hover:underline mt-auto"
                >
                  Ver perfil
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link 
            to="/artistas" 
            className="inline-block text-primary font-medium hover:underline"
          >
            Ver todos los artistas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtists;
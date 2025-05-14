// src/pages/ArtistsPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import { useArtists } from '../hooks/useArtists';
import Button from '../components/common/Button';

const ArtistsPage: React.FC = () => {
  const { data: artists, isLoading, error } = useArtists();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar artistas por término de búsqueda
  const filteredArtists = artists?.filter(artist => {
    const fullName = `${artist.name} ${artist.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  // Animaciones
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

  return (
    <Layout>
      {/* Header */}
      <div className="bg-neutral-lightest py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Nuestros Artistas
          </h1>
          <p className="text-neutral-dark max-w-2xl">
            Conoce a los talentosos artistas que exhiben sus obras en nuestra galería. Explora sus perfiles y descubre sus creaciones únicas.
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        {/* Buscador */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Buscar artistas..."
              className="w-full border border-neutral-light rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading state - CORREGIDO */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({length: 6}, (_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-card p-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-neutral-light rounded-full mb-4"></div>
                  <div className="h-6 bg-neutral-light rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-light rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-neutral-light rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-light rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-neutral-light rounded w-4/6 mb-4"></div>
                  <div className="h-8 bg-neutral-light rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error instanceof Error && (
  <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
    <h3 className="font-bold mb-2">Error al cargar artistas</h3>
    <p>{error.message}</p>
  </div>
)}

        {/* Empty state */}
        {!isLoading && filteredArtists?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">No se encontraron artistas</h3>
            <p className="text-neutral-dark mb-6">No hay artistas que coincidan con tu búsqueda.</p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Limpiar búsqueda
              </Button>
            )}
          </div>
        )}

        {/* Lista de artistas */}
        {!isLoading && filteredArtists && filteredArtists.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredArtists.map((artist) => (
              <motion.div key={artist.id} variants={itemVariants}>
                <Link to={`/artista/${artist.id}`}>
                  <Card className="h-full" hoverable>
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                        <img
                          src={artist.image_url || 'https://via.placeholder.com/128?text=Artista'}
                          alt={`${artist.name} ${artist.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="text-xl font-heading font-bold mb-1">
                        {artist.name} {artist.last_name}
                      </h2>
                      {artist.nationality && (
                        <p className="text-neutral-dark text-sm mb-4">
                          {artist.nationality}
                        </p>
                      )}
                      <div className="mb-4 flex-grow">
                        <p className="text-neutral-dark line-clamp-3">
                          {artist.biography || 
                            'Artista destacado en nuestra galería con obras únicas y expresivas.'}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <Button variant="text">Ver perfil</Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default ArtistsPage;
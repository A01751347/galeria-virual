import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import Button from '../components/common/Button';
import { useArtistDetail } from '../hooks/useArtists';
import { Artwork } from '../types/artwork';

const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useArtistDetail(parseInt(id || '0'));
  
  const artist = data?.artist;
    const artworks: Artwork[] = (data?.artworks || []).map(preview => ({
    id: preview.id,
    title: preview.title,
    main_image_url: preview.main_image_url,
    price: preview.price,
    available: preview.available,
    year_created: preview.year_created,
    artist_id: parseInt(id || '0'), // Usamos el ID del artista actual
    category_id: 0, // Valor por defecto
    technique_id: 0, // Valor por defecto
    description: "", // Valor por defecto
    story: "", // Valor por defecto
    featured: false, // Valor por defecto
    created_at: "", // Valor por defecto
    updated_at: "", // Valor por defecto
    // Asignar el artista actual
    artist: artist ? {
      id: artist.id,
      name: artist.name,
      last_name: artist.last_name
    } : undefined
  }));
  
  // Si está cargando, mostrar un placeholder
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <div className="w-48 h-48 bg-neutral-light rounded-full mx-auto md:mx-0 mb-6"></div>
                <div className="h-8 bg-neutral-light rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-neutral-light rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-neutral-light rounded mb-2 w-full"></div>
                <div className="h-4 bg-neutral-light rounded mb-2 w-full"></div>
                <div className="h-4 bg-neutral-light rounded mb-2 w-3/4"></div>
              </div>
              <div className="md:w-2/3">
                <div className="h-8 bg-neutral-light rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-neutral-light rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Si hay un error, mostrarlo
  if (error || !artist) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>No se pudo cargar la información del artista. Por favor, intenta nuevamente.</p>
            <Link to="/artistas" className="text-red-700 font-medium underline mt-2 inline-block">
              Volver a la lista de artistas
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-neutral-dark hover:text-primary">Inicio</Link>
          <span className="mx-2 text-neutral-dark">/</span>
          <Link to="/artistas" className="text-neutral-dark hover:text-primary">Artistas</Link>
          <span className="mx-2 text-neutral-dark">/</span>
          <span className="text-neutral-darkest font-medium">{artist.name} {artist.last_name}</span>
        </nav>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Información del artista */}
          <motion.div 
            className="md:w-1/3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 text-center md:text-left">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto md:mx-0 mb-6">
                <img
                  src={artist.image_url || 'https://via.placeholder.com/200?text=Artist'}
                  alt={`${artist.name} ${artist.last_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-heading font-bold mb-2">
                {artist.name} {artist.last_name}
              </h1>
              {artist.nationality && (
                <p className="text-neutral-dark mb-4">
                  {artist.nationality}
                </p>
              )}
              
              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                {artist.website && (
                  <a 
                    href={artist.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary-dark transition-colors"
                    aria-label="Sitio web"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.83 19A6.73 6.73 0 012 12.27a6.73 6.73 0 017.83-6.62A6.73 6.73 0 0117.66 12 6.73 6.73 0 019.83 19zm1.3-12.62A4.81 4.81 0 006.3 11.2a4.81 4.81 0 004.83 4.82A4.81 4.81 0 0016 11.2a4.81 4.81 0 00-4.87-4.82z" />
                    </svg>
                  </a>
                )}
                {artist.email && (
                  <a 
                    href={`mailto:${artist.email}`} 
                    className="text-primary hover:text-primary-dark transition-colors"
                    aria-label="Email"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Biografía</h2>
              <div className="text-neutral-dark whitespace-pre-line">
                {artist.biography || 'No hay información biográfica disponible para este artista.'}
              </div>
            </div>
            
            <div className="bg-primary text-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Contactar con el artista</h2>
              <p className="mb-4">
                ¿Interesado en el trabajo de {artist.name}? Ponte en contacto para consultas o encargos personalizados.
              </p>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-primary"
                fullWidth
              >
                Enviar mensaje
              </Button>
            </div>
          </motion.div>
          
          {/* Obras del artista */}
          <motion.div 
            className="md:w-2/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-heading font-bold mb-6">
              Obras de {artist.name}
            </h2>
            
            {artworks.length === 0 ? (
              <div className="bg-neutral-lightest rounded-lg p-8 text-center">
                <p className="text-neutral-dark mb-4">
                  Este artista aún no tiene obras publicadas en nuestra galería.
                </p>
                <Link to="/galeria">
                  <Button variant="primary">
                    Explorar la galería
                  </Button>
                </Link>
              </div>
            ) : (
              <ArtworkGrid artworks={artworks} />
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistDetailPage;
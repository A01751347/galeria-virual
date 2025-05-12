import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import RecentArtworks from '../components/home/RecentArtworks';
import FeaturedArtists from '../components/home/FeaturedArtists';
import { useFeaturedArtworks, useArtworks } from '../hooks/useArtworks';
import { useCategories } from '../hooks/useCategories';
import { useArtists } from '../hooks/useArtists';

const HomePage: React.FC = () => {
  // Obtener obras destacadas para el hero
  const { 
    data: featuredArtworks, 
    isLoading: isFeaturedLoading 
  } = useFeaturedArtworks();
  
  // Obtener obras recientes
  const { 
    data: recentArtworks, 
    isLoading: isRecentLoading 
  } = useArtworks({ sort_by: 'newest' });
  
  // Obtener categorías
  const { 
    data: categories, 
    isLoading: isCategoriesLoading 
  } = useCategories();
  
  // Obtener artistas
  const { 
    data: artists, 
    isLoading: isArtistsLoading 
  } = useArtists();

  return (
    <Layout>
      {/* Hero section */}
      <Hero 
        featuredArtworks={featuredArtworks || []} 
        loading={isFeaturedLoading} 
      />
      
      {/* Categorías destacadas */}
      <CategorySection 
        categories={categories || []} 
        loading={isCategoriesLoading} 
      />
      
      {/* Obras recientes */}
      <RecentArtworks 
        artworks={recentArtworks || []} 
        loading={isRecentLoading} 
      />
      
      {/* Artistas destacados */}
      <FeaturedArtists 
        artists={artists || []} 
        loading={isArtistsLoading} 
      />

      {/* Sección CTA */}
      <div className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            ¿Buscas una obra de arte única?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Explora nuestra galería virtual y encuentra la obra perfecta para tu espacio. También puedes contactarnos para solicitar una obra personalizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/galeria"
              className="bg-white text-primary font-medium py-3 px-6 rounded-md hover:bg-neutral-lightest transition-colors"
            >
              Explorar la galería
            </a>
            <a
              href="/contacto"
              className="bg-transparent text-white font-medium py-3 px-6 rounded-md border border-white hover:bg-white/10 transition-colors"
            >
              Contactar con nosotros
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
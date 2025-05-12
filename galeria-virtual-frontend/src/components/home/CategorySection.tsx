import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types/category';
import Card from '../common/Card';

// Mapeo de imágenes de ejemplo para categorías
// En producción, estas imágenes deberían venir de la API
const categoryImages: Record<string, string> = {
  'Pintura': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=1000',
  'Escultura': 'https://images.unsplash.com/photo-1638624269877-1f8b55da3e71?auto=format&fit=crop&q=80&w=1000',
  'Fotografía': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000',
  'Dibujo': 'https://images.unsplash.com/photo-1618331835746-25ce196e28d6?auto=format&fit=crop&q=80&w=1000',
  'Arte Digital': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000',
  'Grabado': 'https://images.unsplash.com/photo-1629196914168-38a49483fa9b?auto=format&fit=crop&q=80&w=1000',
};

interface CategorySectionProps {
  categories: Category[];
  loading?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories, loading = false }) => {
  // Variantes para animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        <div className="text-center mb-12">
          <div className="h-8 bg-neutral-light rounded w-64 mx-auto animate-pulse mb-4"></div>
          <div className="h-4 bg-neutral-light rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-card">
              <div className="aspect-video bg-neutral-light animate-pulse"></div>
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

  // Si no hay categorías, no mostrar la sección
  if (categories.length === 0) {
    return null;
  }

  // Filtrar categorías para mostrar solo las primeras 6
  const displayCategories = categories.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading font-bold mb-4">
          Categorías destacadas
        </h2>
        <p className="text-neutral-dark max-w-2xl mx-auto">
          Explora nuestras colecciones por categorías y descubre obras únicas de artistas talentosos
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {displayCategories.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <Link to={`/galeria?categoria=${category.id}`}>
              <Card hoverable className="h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={category.image_url || categoryImages[category.name] || categoryImages['Pintura']}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-xl mb-2">
                    {category.name}
                  </h3>
                  <p className="text-neutral-dark text-sm line-clamp-2">
                    {category.description ||
                      (category.name
                        ? `Explora nuestra colección de ${category.name.toLowerCase()} de artistas excepcionales`
                        : 'Explora nuestra colección de obras de artistas excepcionales')}
                  </p>

                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {categories.length > 6 && (
        <div className="text-center mt-10">
          <Link
            to="/categorias"
            className="inline-block text-primary font-medium hover:underline"
          >
            Ver todas las categorías
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategorySection;
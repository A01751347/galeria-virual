import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types/category';
import Card from '../common/Card';

// Mapeo de imágenes de ejemplo para categorías
// En producción, estas imágenes deberían venir de la API
const categoryImages: Record<string, string> = {
  'Pintura': 'https://static.wixstatic.com/media/95c79b_a6e15a18c31e47f29aef688ace611950~mv2.jpg/v1/fit/w_854,h_534,q_90,enc_avif,quality_auto/95c79b_a6e15a18c31e47f29aef688ace611950~mv2.jpg?auto=format&fit=crop&q=80&w=1000',
  'Escultura': 'https://s1.img.bidsquare.com/item/xl/1118/11188304.jpeg?t=1NmaoA&__hstc=69329359.c52a128b6febfb07f2b4a6a6057cc8fa.1747094294690.1747094294690.1747094294690.1&__hssc=69329359.1.1747094294690&__hsfp=2223985451?auto=format&fit=crop&q=80&w=1000',
  'Litografías': 'https://zervinarte.com/cdn/shop/files/litografia-premium-z02litografia-premium-z02-416588.jpg?auto=format&fit=crop&q=80&w=1000',
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
                    className="w-full h-full object-cover object-[center_30%] transition-transform duration-300 group-hover:scale-105"
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
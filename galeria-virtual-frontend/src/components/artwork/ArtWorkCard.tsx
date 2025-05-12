import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Artwork } from '../../types/artwork';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

interface ArtworkCardProps {
  artwork: Artwork;
  className?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Formateamos el precio
  const formattedPrice = formatCurrency(artwork.price);

  return (
    <Card 
      className={`h-full ${className}`}
      padding="none"
      hoverable
    >
      <Link 
        to={`/obra/${artwork.id}`}
        className="block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-square">
          {/* Imagen de la obra */}
          <img
            src={artwork.main_image_url}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          
          {/* Overlay con información */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {/* Badge de disponibilidad */}
            {artwork.available ? (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Disponible
              </span>
            ) : (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Vendido
              </span>
            )}
            
            {/* Badge de destacado */}
            {artwork.featured && (
              <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                Destacado
              </span>
            )}
            
            {/* Título y artista */}
            <h3 className="text-white font-heading font-bold text-lg leading-tight">
              {artwork.title}
            </h3>
            <p className="text-neutral-lightest text-sm mt-1">
              {artwork.artist ? `${artwork.artist.name} ${artwork.artist.last_name}` : 'Artista desconocido'}
            </p>
            
            {/* Precio */}
            <div className="mt-2 text-white font-bold">
              {formattedPrice}
            </div>
          </motion.div>
        </div>
        
        {/* Información adicional (visible en desktop) */}
        <div className="p-4 hidden md:block">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-neutral-darkest truncate">
                {artwork.title}
              </h3>
              <p className="text-neutral-dark text-sm truncate">
                {artwork.artist ? `${artwork.artist.name} ${artwork.artist.last_name}` : 'Artista desconocido'}
              </p>
            </div>
            <div className="text-primary font-bold">
              {formattedPrice}
            </div>
          </div>
          
          {/* Categoría y técnica */}
          <div className="mt-2 flex flex-wrap gap-2">
            {artwork.category && (
              <span className="text-xs bg-neutral-lightest px-2 py-1 rounded-full text-neutral-dark">
                {artwork.category.name}
              </span>
            )}
            {artwork.technique && (
              <span className="text-xs bg-neutral-lightest px-2 py-1 rounded-full text-neutral-dark">
                {artwork.technique.name}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ArtworkCard;
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  padding = 'md',
}) => {
  // Clases base de la tarjeta
  let cardClasses = 'bg-white rounded-lg overflow-hidden shadow-card ';
  
  // Clases según padding
  switch (padding) {
    case 'none':
      cardClasses += '';
      break;
    case 'sm':
      cardClasses += 'p-3 ';
      break;
    case 'md':
      cardClasses += 'p-4 ';
      break;
    case 'lg':
      cardClasses += 'p-6 ';
      break;
    default:
      cardClasses += 'p-4 ';
  }
  
  // Clases para tarjeta interactiva
  if (hoverable || onClick) {
    cardClasses += 'cursor-pointer transition-transform duration-200 ';
  }
  
  // Agregar clases personalizadas
  cardClasses += className;

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02, y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
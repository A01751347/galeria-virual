import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

// Tipos de variante para el botón
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Props del componente
interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  let buttonClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ';

  switch (variant) {
    case 'primary':
      buttonClasses += 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light ';
      break;
    case 'secondary':
      buttonClasses += 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary-light ';
      break;
    case 'outline':
      buttonClasses += 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary ';
      break;
    case 'text':
      buttonClasses += 'text-primary hover:bg-neutral-lightest focus:ring-primary ';
      break;
    case 'danger':
      buttonClasses += 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 ';
      break;
    default:
      buttonClasses += 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light ';
  }

  switch (size) {
    case 'sm':
      buttonClasses += 'text-xs px-3 py-2 ';
      break;
    case 'md':
      buttonClasses += 'text-sm px-4 py-2 ';
      break;
    case 'lg':
      buttonClasses += 'text-base px-6 py-3 ';
      break;
    default:
      buttonClasses += 'text-sm px-4 py-2 ';
  }

  if (fullWidth) {
    buttonClasses += 'w-full ';
  }

  if (disabled || isLoading) {
    buttonClasses += 'opacity-70 cursor-not-allowed ';
  }

  buttonClasses += className;

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}

      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}

      {children}

      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;

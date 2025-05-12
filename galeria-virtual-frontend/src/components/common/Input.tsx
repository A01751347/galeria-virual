import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

// Props del componente
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      label,
      error,
      icon,
      iconPosition = 'left',
      className = '',
      fullWidth = false,
      ...props
    }, 
    ref
  ) => {
    // Clases base del input
    let inputClasses = 'block border-neutral-medium rounded-md focus:ring-primary focus:border-primary focus:outline-none ';
    
    // Si hay icono, añadir padding
    if (icon) {
      inputClasses += iconPosition === 'left' ? 'pl-10 ' : 'pr-10 ';
    }
    
    // Si hay error, cambiar color del borde
    if (error) {
      inputClasses += 'border-red-500 focus:border-red-500 focus:ring-red-500 ';
    } else {
      inputClasses += 'border-neutral-medium ';
    }
    
    // Clases según ancho
    if (fullWidth) {
      inputClasses += 'w-full ';
    }
    
    // Agregar clases personalizadas
    inputClasses += className;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label className="block text-neutral-darkest font-medium mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-dark">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-dark">
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  // Determinar clase de ancho máximo
  let maxWidthClass = '';
  switch (maxWidth) {
    case 'sm': maxWidthClass = 'max-w-sm'; break;
    case 'md': maxWidthClass = 'max-w-md'; break;
    case 'lg': maxWidthClass = 'max-w-lg'; break;
    case 'xl': maxWidthClass = 'max-w-xl'; break;
    default: maxWidthClass = 'max-w-md';
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay de fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Contenedor del modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`bg-white rounded-lg shadow-elevated ${maxWidthClass} w-full max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabecera del modal */}
              {title && (
                <div className="p-4 border-b border-neutral-light">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-heading font-bold">{title}</h3>
                    <button
                      type="button"
                      className="text-neutral-dark hover:text-neutral-darkest"
                      onClick={onClose}
                      aria-label="Cerrar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Contenido del modal */}
              <div className="p-4">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
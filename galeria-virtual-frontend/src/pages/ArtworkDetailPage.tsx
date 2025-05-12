import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { useArtworkDetail } from '../hooks/useArtwork';
import { formatCurrency } from '../utils/formatters';

const ArtworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useArtworkDetail(parseInt(id || '0'));
  const [activeImage, setActiveImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Si está cargando, mostrar un placeholder
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-light rounded w-1/3 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="aspect-square bg-neutral-light rounded"></div>
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-20 h-20 bg-neutral-light rounded"></div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/3">
                <div className="h-6 bg-neutral-light rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-neutral-light rounded w-2/3 mb-6"></div>
                <div className="h-4 bg-neutral-light rounded mb-2"></div>
                <div className="h-4 bg-neutral-light rounded mb-2"></div>
                <div className="h-4 bg-neutral-light rounded mb-6 w-2/3"></div>
                <div className="h-10 bg-neutral-light rounded mb-3"></div>
                <div className="h-10 bg-neutral-light rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Si hay un error, mostrarlo
  if (error || !data) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>No se pudo cargar la información de la obra. Por favor, intenta nuevamente.</p>
            <Link to="/galeria" className="text-red-700 font-medium underline mt-2 inline-block">
              Volver a la galería
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { artwork, related_artworks } = data;
  
  // Preparar imágenes para la galería, empezando con la imagen principal
  const allImages = [
    { url: artwork.main_image_url, title: artwork.title },
    ...(artwork.additional_images || []).map(img => ({
      url: img.image_url,
      title: img.title || artwork.title
    }))
  ];

  // Cambiar a imagen anterior
  const prevImage = () => {
    setActiveImage((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };
  
  // Cambiar a imagen siguiente
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % allImages.length);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-neutral-dark hover:text-primary">Inicio</Link>
          <span className="mx-2 text-neutral-dark">/</span>
          <Link to="/galeria" className="text-neutral-dark hover:text-primary">Galería</Link>
          <span className="mx-2 text-neutral-dark">/</span>
          <span className="text-neutral-darkest font-medium">{artwork.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda: Imágenes */}
          <div className="lg:w-2/3">
            {/* Imagen principal */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={allImages[activeImage].url}
                  alt={allImages[activeImage].title}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Botones de navegación */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full"
                    aria-label="Imagen anterior"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full"
                    aria-label="Imagen siguiente"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      activeImage === index
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Descripción y detalles adicionales en pantallas pequeñas */}
            <div className="mt-8 lg:hidden">
              <h1 className="text-3xl font-heading font-bold mb-2">{artwork.title}</h1>
              <Link to={`/artista/${artwork.artist_id}`} className="text-primary hover:underline">
                {artwork.artist?.name} {artwork.artist?.last_name}
              </Link>

              <div className="mt-4">
                <h2 className="font-bold text-xl mb-2">Descripción</h2>
                <p className="text-neutral-dark whitespace-pre-line">{artwork.description}</p>
              </div>

              {artwork.story && (
                <div className="mt-6">
                  <h2 className="font-bold text-xl mb-2">Historia de la obra</h2>
                  <p className="text-neutral-dark whitespace-pre-line">{artwork.story}</p>
                </div>
              )}

              <div className="mt-6 bg-neutral-lightest p-4 rounded-lg">
                <h3 className="font-bold mb-2">Detalles técnicos</h3>
                <ul className="space-y-2">
                  {artwork.technique && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Técnica:</span>
                      <span className="font-medium">{artwork.technique.name}</span>
                    </li>
                  )}
                  {artwork.category && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Categoría:</span>
                      <span className="font-medium">{artwork.category.name}</span>
                    </li>
                  )}
                  {artwork.year_created && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Año:</span>
                      <span className="font-medium">{artwork.year_created}</span>
                    </li>
                  )}
                  {artwork.dimensions && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Dimensiones:</span>
                      <span className="font-medium">{artwork.dimensions}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Precio y botones - Móvil */}
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(artwork.price)}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setIsContactModalOpen(true)}
                    disabled={!artwork.available}
                  >
                    {artwork.available ? 'Consultar obra' : 'Obra no disponible'}
                  </Button>
                  {artwork.available && (
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      Hacer oferta
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Información y acciones */}
          <div className="lg:w-1/3 hidden lg:block">
            <div className="sticky top-24">
              <h1 className="text-3xl font-heading font-bold mb-2">{artwork.title}</h1>
              <Link to={`/artista/${artwork.artist_id}`} className="text-primary hover:underline">
                {artwork.artist?.name} {artwork.artist?.last_name}
              </Link>

              <div className="mt-4">
                <h2 className="font-bold text-xl mb-2">Descripción</h2>
                <p className="text-neutral-dark whitespace-pre-line">{artwork.description}</p>
              </div>

              {artwork.story && (
                <div className="mt-6">
                  <h2 className="font-bold text-xl mb-2">Historia de la obra</h2>
                  <p className="text-neutral-dark whitespace-pre-line">{artwork.story}</p>
                </div>
              )}

              <div className="mt-6 bg-neutral-lightest p-4 rounded-lg">
                <h3 className="font-bold mb-2">Detalles técnicos</h3>
                <ul className="space-y-2">
                  {artwork.technique && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Técnica:</span>
                      <span className="font-medium">{artwork.technique.name}</span>
                    </li>
                  )}
                  {artwork.category && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Categoría:</span>
                      <span className="font-medium">{artwork.category.name}</span>
                    </li>
                  )}
                  {artwork.year_created && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Año:</span>
                      <span className="font-medium">{artwork.year_created}</span>
                    </li>
                  )}
                  {artwork.dimensions && (
                    <li className="flex justify-between">
                      <span className="text-neutral-dark">Dimensiones:</span>
                      <span className="font-medium">{artwork.dimensions}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Precio y botones - Desktop */}
              <div className="mt-6">
                <p className="text-2xl font-bold text-primary mb-4">
                  {formatCurrency(artwork.price)}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setIsContactModalOpen(true)}
                    disabled={!artwork.available}
                  >
                    {artwork.available ? 'Consultar obra' : 'Obra no disponible'}
                  </Button>
                  {artwork.available && (
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      Hacer oferta
                    </Button>
                  )}
                </div>
              </div>

              {/* Compartir */}
              <div className="mt-6">
                <h3 className="font-bold mb-2">Compartir</h3>
                <div className="flex gap-2">
                  <button 
                    className="p-2 rounded-full bg-[#1877F2] text-white"
                    aria-label="Compartir en Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-full bg-[#1DA1F2] text-white"
                    aria-label="Compartir en Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-full bg-[#E60023] text-white"
                    aria-label="Compartir en Pinterest"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-full bg-neutral-lightest text-neutral-dark"
                    aria-label="Compartir por correo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Obras relacionadas */}
        {related_artworks && related_artworks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold mb-6">Obras relacionadas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related_artworks.map((relatedArtwork) => (
                <Link 
                  key={relatedArtwork.id} 
                  to={`/obra/${relatedArtwork.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-card">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedArtwork.main_image_url} 
                        alt={relatedArtwork.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{relatedArtwork.title}</h3>
                      <p className="text-sm text-primary font-bold mt-1">
                        {formatCurrency(relatedArtwork.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de contacto */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold mb-4">Consultar sobre esta obra</h2>
              <p className="text-neutral-dark mb-6">
                Complete el formulario a continuación y nos pondremos en contacto con usted lo antes posible.
              </p>
              
              <form>
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-neutral-darkest font-medium mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="w-full border border-neutral-light rounded-md p-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-neutral-darkest font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-neutral-light rounded-md p-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="telefono" className="block text-neutral-darkest font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    className="w-full border border-neutral-light rounded-md p-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="mensaje" className="block text-neutral-darkest font-medium mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    rows={4}
                    className="w-full border border-neutral-light rounded-md p-2 focus:ring-primary focus:border-primary"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsContactModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Enviar consulta
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ArtworkDetailPage;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clases para el header
  const headerClasses = `fixed w-full z-50 transition-all duration-300 ${
  isScrolled || !isHomePage
    ? 'backdrop-blur-md bg-white/30 border-b border-white/20 shadow-md py-2'  // cuando haces scroll
    : 'backdrop-blur-sm bg-gray-800/40 border-b border-gray-700 py-4'         // cuando estás arriba
}`;




  // Clases para links de navegación
 const navLinkClasses = `font-medium transition-colors hover:text-primary ${
  isScrolled || !isHomePage ? 'text-gray-700' : 'text-gray-100'
}`;


  // Toggle para menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 
            className={`text-2xl font-heading font-bold ${
              isScrolled || !isHomePage ? 'text-primary' : 'text-white'
            }`}
          >
            Galería Virtual
          </h1>
        </Link>

        {/* Navegación - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClasses}>
            Home
          </Link>
          <Link to="/galeria" className={navLinkClasses}>
            Galería
          </Link>
          <Link to="/artistas" className={navLinkClasses}>
            Artistas
          </Link>
          <Link to="/nosotros" className={navLinkClasses}>
            Nosotros
          </Link>
          <Link to="/contacto" className={navLinkClasses}>
            Contacto
          </Link>
        </nav>

        {/* Botones de acción - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                  {user?.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-elevated bg-white overflow-hidden transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 origin-top-right transition-all duration-200">
                  <div className="py-1">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/favoritos"
                      className="block px-4 py-2 text-sm text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Mis Favoritos
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-neutral-darkest hover:bg-neutral-lightest"
                      >
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-lightest"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
              <Link to="/galeria">
                <Button variant="primary">Explorar</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/galeria">
                <Button variant="primary">Explorar</Button>
              </Link>
            </>
          )}
        </div>

        {/* Botón de menú - Móvil */}
        <button
          className="md:hidden text-primary p-2"
          onClick={toggleMenu}
          aria-label="Menú"
        >
          {menuOpen ? (
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
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
  transition={{ duration: 0.3 }}
  className="md:hidden bg-gray-900/90 backdrop-blur-md border-t border-gray-700 shadow-md"
>

            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-neutral-darkest font-medium hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/galeria"
                  className="text-neutral-darkest font-medium hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Galería
                </Link>
                <Link
                  to="/artistas"
                  className="text-neutral-darkest font-medium hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Artistas
                </Link>
                <Link
                  to="/nosotros"
                  className="text-neutral-darkest font-medium hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className="text-neutral-darkest font-medium hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </Link>
                <div className="h-px bg-neutral-light my-2"></div>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/perfil"
                      className="text-neutral-darkest font-medium hover:text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/favoritos"
                      className="text-neutral-darkest font-medium hover:text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mis Favoritos
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-neutral-darkest font-medium hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="text-left text-red-600 font-medium hover:text-red-700"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" fullWidth>
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/registro" onClick={() => setMenuOpen(false)}>
                      <Button variant="primary" fullWidth>
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
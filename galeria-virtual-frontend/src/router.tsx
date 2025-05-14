import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Páginas
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import ArtistsPage from './pages/ArtistsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ArtistDetailPage from './pages/ArtistDetailPage';

// Rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/galeria',
    element: <GalleryPage />,
  },
  {
    path: '/obra/:id',
    element: <ArtworkDetailPage />,
  },
  {
    path: '/artistas',
    element: <ArtistsPage />,
  },
  {
    path: '/nosotros',
    element: <AboutPage />,
  },
  {
    path: '/contacto',
    element: <ContactPage />,
  },
  // En router.tsx, añade esta ruta:
{
  path: '/artista/:id',
  element: <ArtistDetailPage />,
},
  // Aquí se pueden agregar más rutas
]);

const Router: React.FC = () => {
  return (<RouterProvider router={router} />);
};

export default Router;
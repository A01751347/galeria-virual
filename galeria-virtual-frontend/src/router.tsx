import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Páginas públicas
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Páginas de administración
import DashboardAdmin from './pages/DashboardAdmin';
import AdminArtworksPage from './pages/AdminArtworksPage';
import AdminArtworkFormPage from './pages/AdminArtworkFormPage';

// Rutas
const router = createBrowserRouter([
  // Rutas públicas
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
    path: '/artista/:id',
    element: <ArtistDetailPage />,
  },
  {
    path: '/nosotros',
    element: <AboutPage />,
  },
  {
    path: '/contacto',
    element: <ContactPage />,
  },
  
  // Rutas de administración
  {
    path: '/admin',
    element: <DashboardAdmin />,
  },
  {
    path: '/admin/obras',
    element: <AdminArtworksPage />,
  },
  {
    path: '/admin/obras/nueva',
    element: <AdminArtworkFormPage />,
  },
  {
    path: '/admin/obras/editar/:id',
    element: <AdminArtworkFormPage />,
  },
  // Aquí se agregarían más rutas de administración...
]);

const Router: React.FC = () => {
  return (<RouterProvider router={router} />);
};

export default Router;
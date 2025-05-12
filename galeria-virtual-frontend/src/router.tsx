import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Páginas
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';

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
  // Aquí se pueden agregar más rutas
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
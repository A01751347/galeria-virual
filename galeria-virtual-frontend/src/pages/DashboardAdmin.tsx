import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartPieIcon,
  CurrencyDollarIcon,
  SwatchIcon,
  UserGroupIcon,
  PhotoIcon,
  ChatBubbleBottomCenterTextIcon,
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';

// Hook para obtener estadísticas
const useAdminStats = () => {
  // Aquí se podría conectar con la API
  // Por ahora usamos datos ficticios
  return {
    data: {
      totalArtworks: 120,
      availableArtworks: 75,
      totalArtists: 45,
      totalCategories: 8,
      totalTechniques: 12,
      totalQueries: 36,
      totalSales: 22,
      totalRevenue: 12500,
      totalCommission: 2500,
      totalVisits: 1845,
      recentArtworks: [
        { id: 1, title: 'Campos de Iris', artist: 'Gabriel Orozco', price: 15000, main_image_url: 'https://example.com/image1.jpg' },
        { id: 2, title: 'Reflexiones Acuáticas', artist: 'Frida Kahlo', price: 25000, main_image_url: 'https://example.com/image2.jpg' },
      ],
      recentQueries: [
        { id: 1, artwork_title: 'Campos de Iris', name: 'Juan Pérez', email: 'juan@example.com', date: '2023-05-10' },
        { id: 2, artwork_title: 'Reflexiones Acuáticas', name: 'María López', email: 'maria@example.com', date: '2023-05-09' },
      ]
    },
    isLoading: false,
    error: null
  };
};

const DashboardAdmin: React.FC = () => {
  const { data, isLoading, error } = useAdminStats();
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          {/* Skeleton loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Error al cargar el dashboard</h2>
          <p>Lo sentimos, no pudimos cargar los datos del dashboard. Por favor, intenta nuevamente más tarde.</p>
        </div>
      </AdminLayout>
    );
  }
  
  // Animación de entrada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Bienvenido al panel de administración</h2>
        <p className="text-neutral-dark">Gestiona tu galería virtual desde aquí</p>
      </div>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Cards de estadísticas */}
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-purple-100 text-primary mr-4">
              <PhotoIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Obras totales</p>
              <p className="text-xl font-bold">{data.totalArtworks}</p>
              <p className="text-xs text-green-600">{data.availableArtworks} disponibles</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Artistas</p>
              <p className="text-xl font-bold">{data.totalArtists}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Consultas</p>
              <p className="text-xl font-bold">{data.totalQueries}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Ventas</p>
              <p className="text-xl font-bold">{data.totalSales}</p>
              <p className="text-xs text-green-600">${data.totalRevenue.toLocaleString()}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Comisiones</p>
              <p className="text-xl font-bold">${data.totalCommission.toLocaleString()}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <EyeIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Visitas</p>
              <p className="text-xl font-bold">{data.totalVisits.toLocaleString()}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <HeartIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Categorías</p>
              <p className="text-xl font-bold">{data.totalCategories}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <SwatchIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-dark">Técnicas</p>
              <p className="text-xl font-bold">{data.totalTechniques}</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Obras recientes */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-4 border-b border-neutral-light">
              <h3 className="text-lg font-bold">Obras recientes</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {data.recentArtworks.map((artwork) => (
                  <div key={artwork.id} className="flex items-center">
                    <div className="w-12 h-12 bg-neutral-light rounded overflow-hidden mr-4">
                      <img
                        src={artwork.main_image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{artwork.title}</h4>
                      <p className="text-sm text-neutral-dark">{artwork.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${artwork.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/admin/obras"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Ver todas las obras
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Consultas recientes */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-4 border-b border-neutral-light">
              <h3 className="text-lg font-bold">Consultas recientes</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {data.recentQueries.map((query) => (
                  <div key={query.id} className="flex items-start">
                    <div className="w-10 h-10 bg-neutral-light rounded-full flex items-center justify-center mr-4">
                      <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-neutral-dark" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{query.name}</h4>
                      <p className="text-sm text-neutral-dark">{query.email}</p>
                      <p className="text-sm">Consulta sobre: {query.artwork_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-dark">{query.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/admin/consultas"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Ver todas las consultas
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
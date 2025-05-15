import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { AnimatePresence, motion } from 'framer-motion';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useArtworkDelete, useArtworks } from '../hooks/useArtworks';
import { formatCurrency } from '../utils/formatters';
import { logWithColor } from '../utils/debugHelper';
import Modal from '../components/common/Modal';
import artworkService from '../services/artworkService';

const AdminArtworksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);  
  const { data: artworks, isLoading, error, refetch } = useArtworks();
  
  

  // Estado para el modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
                           
  
  // Filtrar obras por término de búsqueda
  const filteredArtworks = artworks?.filter(artwork => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      artwork.title.toLowerCase().includes(lowerSearchTerm) ||
      artwork.artist?.name.toLowerCase().includes(lowerSearchTerm) ||
      artwork.artist?.last_name.toLowerCase().includes(lowerSearchTerm)
    );
  });

   const confirmDelete = useCallback((id: number) => {
    setArtworkToDelete(id);
    setDeleteModalOpen(true);
    setDeleteError(null);
  }, []);
  
  // Función para manejar la eliminación de la obra
  const handleDeleteArtwork = useCallback(async () => {
    if (!artworkToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      logWithColor('info', `Eliminando obra con ID: ${artworkToDelete}`);
      
      const success = await artworkService.deleteArtwork(artworkToDelete);
      
      if (success) {
        logWithColor('success', 'Obra eliminada correctamente');
        
        // Cerrar el modal y actualizar la lista de obras
        setDeleteModalOpen(false);
        refetch();
      } else {
        throw new Error('No se pudo eliminar la obra');
      }
    } catch (error) {
      logWithColor('error', 'Error al eliminar obra:', error);
      setDeleteError('Ocurrió un error al eliminar la obra. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  }, [artworkToDelete, refetch]);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Obras</h2>
          <p className="text-neutral-dark">Administra las obras de arte de la galería</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/admin/obras/nueva">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-5 h-5 mr-2" />}
            >
              Nueva Obra
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar obras por título o artista..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="w-5 h-5 text-neutral-dark" />
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                icon={<FunnelIcon className="w-5 h-5 mr-2" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <motion.div
              className="mt-4 p-4 border-t border-neutral-light"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select className="w-full border border-neutral-light rounded-md p-2">
                    <option value="">Todas las categorías</option>
                    {/* Opciones de categorías */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Artista</label>
                  <select className="w-full border border-neutral-light rounded-md p-2">
                    <option value="">Todos los artistas</option>
                    {/* Opciones de artistas */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select className="w-full border border-neutral-light rounded-md p-2">
                    <option value="">Todos</option>
                    <option value="available">Disponibles</option>
                    <option value="sold">Vendidas</option>
                    <option value="featured">Destacadas</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="primary" size="sm">
                  Aplicar filtros
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 flex items-center">
              <div className="w-16 h-16 bg-neutral-light rounded mr-4" />
              <div className="flex-1">
                <div className="h-5 bg-neutral-light rounded w-1/3 mb-2" />
                <div className="h-4 bg-neutral-light rounded w-1/4" />
              </div>
              <div className="h-8 bg-neutral-light rounded w-20" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Error al cargar las obras</h3>
          <p>Lo sentimos, no pudimos cargar la lista de obras. Por favor, intenta nuevamente más tarde.</p>
        </div>
      ) : filteredArtworks?.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No se encontraron obras</h3>
          <p className="text-neutral-dark mb-6">
            {searchTerm
              ? `No hay obras que coincidan con "${searchTerm}"`
              : 'No hay obras registradas en la galería aún.'}
          </p>
          <Link to="/admin/obras/nueva">
            <Button variant="primary">Crear nueva obra</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-light">
              <thead className="bg-neutral-lightest">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Obra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Artista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-dark uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-light">
                {filteredArtworks?.map((artwork) => (
                  <tr key={artwork.id} className="hover:bg-neutral-lightest">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded overflow-hidden mr-3">
                          <img
                            src={artwork.main_image_url}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                            // onError={(e) => {
                            //   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                            // }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{artwork.title}</div>
                          <div className="text-sm text-gray-500">ID: {artwork.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {artwork.artist?.name} {artwork.artist?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {artwork.category?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatCurrency(artwork.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          artwork.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {artwork.available ? 'Disponible' : 'Vendida'}
                      </span>
                      {artwork.featured && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Destacada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/obras/editar/${artwork.id}`}
                       className="text-blue-600 hover:text-blue-900 mr-3"
                     >
                       <PencilIcon className="w-5 h-5 inline" />
                     </Link>
                     <button
                       className="text-red-600 hover:text-red-900"
                        onClick={() => confirmDelete(artwork.id)}
                        title="Eliminar obra"
                     >
                       <TrashIcon className="w-5 h-5 inline" />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     )}
     <AnimatePresence>
        {deleteModalOpen && (
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Confirmar eliminación"
            maxWidth="sm"
          >
            <div className="p-4">
              <p className="mb-6">
                ¿Estás seguro de que deseas eliminar esta obra? Esta acción no se puede deshacer.
              </p>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {deleteError}
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteArtwork}
                  isLoading={isDeleting}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
   </AdminLayout>
 );
};

export default AdminArtworksPage;
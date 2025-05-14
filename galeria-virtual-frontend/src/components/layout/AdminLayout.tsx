import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  PhotoIcon,
  UserGroupIcon,
  TagIcon,
  SwatchIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/obras', label: 'Obras', icon: PhotoIcon },
    { path: '/admin/artistas', label: 'Artistas', icon: UserGroupIcon },
    { path: '/admin/categorias', label: 'Categorías', icon: TagIcon },
    { path: '/admin/tecnicas', label: 'Técnicas', icon: SwatchIcon },
    { path: '/admin/consultas', label: 'Consultas', icon: ChatBubbleBottomCenterTextIcon },
    { path: '/admin/ventas', label: 'Ventas', icon: CurrencyDollarIcon },
    { path: '/admin/estadisticas', label: 'Estadísticas', icon: ChartBarIcon },
    { path: '/admin/configuracion', label: 'Configuración', icon: Cog6ToothIcon },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="flex h-screen bg-neutral-lightest">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-sm bg-white border-r border-neutral-light overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-neutral-light">
            <Link to="/admin" className="text-xl font-heading font-bold text-primary">
              Panel Admin
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-neutral-dark rounded hover:bg-neutral-lightest"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg ${
                      isActiveRoute(item.path)
                        ? 'bg-primary text-white'
                        : 'text-neutral-dark hover:bg-neutral-lightest'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-neutral-light">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-neutral-lightest"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-neutral-light md:bg-white">
        <div className="flex items-center h-16 px-6 border-b border-neutral-light">
          <Link to="/admin" className="text-xl font-heading font-bold text-primary">
            Panel Admin
          </Link>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg ${
                      isActiveRoute(item.path)
                        ? 'bg-primary text-white'
                        : 'text-neutral-dark hover:bg-neutral-lightest'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-neutral-light">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-neutral-lightest"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 px-6 bg-white border-b border-neutral-light">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 mr-4 text-neutral-dark rounded hover:bg-neutral-lightest"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-medium">
              {menuItems.find(item => isActiveRoute(item.path))?.label || 'Panel de Administración'}
            </h1>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">
                  {user?.name} {user?.last_name}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {user?.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-lightest">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

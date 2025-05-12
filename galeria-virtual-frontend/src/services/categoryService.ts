import api from './api';
import { Category, Technique } from '../types/category';

const categoryService = {
  // Obtener todas las categorías
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categorias');
    return response.data.data;
  },
  
  // Obtener detalle de una categoría
  getCategoryDetail: async (id: number): Promise<Category> => {
    const response = await api.get(`/categorias/${id}`);
    return response.data.data;
  },
  
  // Crear una nueva categoría (requiere autenticación de admin)
  createCategory: async (categoryData: { nombre: string; descripcion?: string }): Promise<Category> => {
    const response = await api.post('/categorias', categoryData);
    return response.data.data;
  },
  
  // Actualizar una categoría (requiere autenticación de admin)
  updateCategory: async (id: number, categoryData: { nombre: string; descripcion?: string }): Promise<Category> => {
    const response = await api.put(`/categorias/${id}`, categoryData);
    return response.data.data;
  },
  
  // Eliminar una categoría (requiere autenticación de admin)
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
  
  // Obtener todas las técnicas
  getTechniques: async (): Promise<Technique[]> => {
    const response = await api.get('/tecnicas');
    return response.data.data;
  },
  
  // Obtener detalle de una técnica
  getTechniqueDetail: async (id: number): Promise<Technique> => {
    const response = await api.get(`/tecnicas/${id}`);
    return response.data.data;
  },
  
  // Crear una nueva técnica (requiere autenticación de admin)
  createTechnique: async (techniqueData: { nombre: string; descripcion?: string }): Promise<Technique> => {
    const response = await api.post('/tecnicas', techniqueData);
    return response.data.data;
  },
  
  // Actualizar una técnica (requiere autenticación de admin)
  updateTechnique: async (id: number, techniqueData: { nombre: string; descripcion?: string }): Promise<Technique> => {
    const response = await api.put(`/tecnicas/${id}`, techniqueData);
    return response.data.data;
  },
  
  // Eliminar una técnica (requiere autenticación de admin)
  deleteTechnique: async (id: number): Promise<void> => {
    await api.delete(`/tecnicas/${id}`);
  },
};

export default categoryService;
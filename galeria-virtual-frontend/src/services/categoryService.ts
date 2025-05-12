// src/services/categoryService.ts
import api from './api';
import { Category, Technique } from '../types/category';
import { adaptCategory, adaptTechnique } from '../utils/dataAdapter';

const categoryService = {
  // Obtener todas las categorías
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categorias');
    return response.data.data.map(adaptCategory);
  },
  
  // Obtener detalle de una categoría
  getCategoryDetail: async (id: number): Promise<Category> => {
    const response = await api.get(`/categorias/${id}`);
    return adaptCategory(response.data.data);
  },
  
  // Obtener todas las técnicas
  getTechniques: async (): Promise<Technique[]> => {
    const response = await api.get('/tecnicas');
    return response.data.data.map(adaptTechnique);
  },
  
  // Obtener detalle de una técnica
  getTechniqueDetail: async (id: number): Promise<Technique> => {
    const response = await api.get(`/tecnicas/${id}`);
    return adaptTechnique(response.data.data);
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
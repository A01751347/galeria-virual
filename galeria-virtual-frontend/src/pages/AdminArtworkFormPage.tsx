import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { useCategories, useTechniques } from '../hooks/useCategories';
import { useArtists } from '../hooks/useArtists';
import { useArtworkDetail } from '../hooks/useArtworks';

const AdminArtworkFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  // Datos iniciales del formulario
  const initialFormData = {
    title: '',
    artist_id: '',
    category_id: '',
    technique_id: '',
    year_created: '',
    dimensions: '',
    price: '',
    description: '',
    story: '',
    available: true,
    featured: false,
    main_image: null as File | null,
    main_image_url: '',
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Obtener datos para los selects
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: techniques, isLoading: techniquesLoading } = useTechniques();
  const { data: artists, isLoading: artistsLoading } = useArtists();
  
  // Si estamos editando, obtener datos de la obra
  const { data: artworkData, isLoading: artworkLoading } = useArtworkDetail(
    isEditing ? parseInt(id as string) : 0,
    { enabled: isEditing }
  );
  
  // Cargar datos de la obra si estamos editando
  useEffect(() => {
    if (isEditing && artworkData?.artwork) {
      const artwork = artworkData.artwork;
      setFormData({
        title: artwork.title,
        artist_id: artwork.artist_id.toString(),
        category_id: artwork.category_id.toString(),
        technique_id: artwork.technique_id.toString(),
        year_created: artwork.year_created?.toString() || '',
        dimensions: artwork.dimensions || '',
        price: artwork.price.toString(),
        description: artwork.description,
        story: artwork.story || '',
        available: artwork.available,
        featured: artwork.featured,
        main_image: null,
        main_image_url: artwork.main_image_url,
      });
      
      // Establecer preview de la imagen
      setImagePreview(artwork.main_image_url);
    }
  }, [isEditing, artworkData]);
  
  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar el error al modificar el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, main_image: file }));
    
    // Generar preview de la imagen
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Si no hay archivo y estamos editando, mantener la imagen actual
      if (isEditing && artworkData?.artwork) {
        setImagePreview(artworkData.artwork.main_image_url);
      } else {
        setImagePreview(null);
      }
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.artist_id) {
      newErrors.artist_id = 'Selecciona un artista';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Selecciona una categoría';
    }
    
    if (!formData.technique_id) {
      newErrors.technique_id = 'Selecciona una técnica';
    }
    
    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número positivo';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    // Si es una obra nueva, la imagen es obligatoria
    if (!isEditing && !formData.main_image) {
      newErrors.main_image = 'La imagen es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Crear FormData para enviar la imagen
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('artist_id', formData.artist_id);
      submitData.append('category_id', formData.category_id);
      submitData.append('technique_id', formData.technique_id);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      
      if (formData.year_created) {
        submitData.append('year_created', formData.year_created);
      }
      
      if (formData.dimensions) {
        submitData.append('dimensions', formData.dimensions);
      }
      
      if (formData.story) {
        submitData.append('story', formData.story);
      }
      
      submitData.append('available', formData.available.toString());
      submitData.append('featured', formData.featured.toString());
      
      // Agregar imagen si existe
      if (formData.main_image) {
        submitData.append('imagen', formData.main_image);
      }
      
      // Enviar a la API
      // En un caso real, aquí se enviaría a la API
      console.log('Enviando datos:', Object.fromEntries(submitData.entries()));
      
      // Simular una petición exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireccionar a la lista de obras
      navigate('/admin/obras');
    } catch (error) {
      console.error('Error al guardar la obra:', error);
      // Mostrar error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determinar si estamos cargando datos iniciales
  const isInitialLoading = (isEditing && artworkLoading) || categoriesLoading || techniquesLoading || artistsLoading;
  
  if (isInitialLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-light rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-neutral-light rounded w-1/4 mb-8"></div>
          
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-neutral-light rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Editar Obra' : 'Nueva Obra'}
        </h2>
        <p className="text-neutral-dark">
          {isEditing
            ? 'Modifica los datos de la obra'
            : 'Ingresa los datos para crear una nueva obra'}
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div>
              <Input
                label="Título *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                fullWidth
              />
              
              <div className="mb-4">
                <label className="block text-neutral-darkest font-medium mb-1">
                  Artista *
                </label>
                <select
                  name="artist_id"
                  className={`w-full border ${
                    errors.artist_id ? 'border-red-500' : 'border-neutral-medium'
                  } rounded-md p-2 focus:ring-primary focus:border-primary`}
                  value={formData.artist_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un artista</option>
                  {artists?.map(artist => (
                    <option key={artist.id} value={artist.id.toString()}>
                      {artist.name} {artist.last_name}
                    </option>
                  ))}
                </select>
                {errors.artist_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.artist_id}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-neutral-darkest font-medium mb-1">
                  Categoría *
                </label>
                <select
                  name="category_id"
                  className={`w-full border ${
                    errors.category_id ? 'border-red-500' : 'border-neutral-medium'
                  } rounded-md p-2 focus:ring-primary focus:border-primary`}
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-neutral-darkest font-medium mb-1">
                  Técnica *
                </label>
                <select
                  name="technique_id"
                  className={`w-full border ${
                    errors.technique_id ? 'border-red-500' : 'border-neutral-medium'
                  } rounded-md p-2 focus:ring-primary focus:border-primary`}
                  value={formData.technique_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una técnica</option>
                  {techniques?.map(technique => (
                    <option key={technique.id} value={technique.id.toString()}>
                      {technique.name}
                    </option>
                  ))}
                </select>
                {errors.technique_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.technique_id}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Año de creación"
                  name="year_created"
                  type="number"
                  value={formData.year_created}
                  onChange={handleChange}
                  fullWidth
                />
                
                <Input
                  label="Dimensiones"
                  name="dimensions"
                  placeholder="Ej: 30x40 cm"
                  value={formData.dimensions}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
              
              <Input
                label="Precio *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                fullWidth
              />
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
                    checked={formData.available}
                    onChange={(e) => handleChange(e)}
                  />
                  <label htmlFor="available" className="ml-2 block font-medium">
                    Disponible para venta
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
                    checked={formData.featured}
                    onChange={(e) => handleChange(e)}
                  />
                  <label htmlFor="featured" className="ml-2 block font-medium">
                    Destacada en página principal
                  </label>
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div>
              <div className="mb-4">
                <label className="block text-neutral-darkest font-medium mb-1">
                  Imagen principal {!isEditing && '*'}
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-light border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-3">
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          className="mx-auto h-32 object-contain"
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-neutral-dark"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm justify-center">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Subir imagen</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-neutral-dark">
                      PNG, JPG, GIF hasta 5MB
                    </p>
                  </div>
                </div>
                {errors.main_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.main_image}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-neutral-darkest font-medium mb-1">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className={`w-full border ${
                    errors.description ? 'border-red-500' : 'border-neutral-medium'
                  } rounded-md p-2 focus:ring-primary focus:border-primary`}
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-neutral-darkest font-medium mb-1">
                  Historia de la obra
                </label>
                <textarea
                  name="story"
                  rows={4}
                  className="w-full border border-neutral-medium rounded-md p-2 focus:ring-primary focus:border-primary"
                  value={formData.story}
                  onChange={handleChange}
                ></textarea>
                <p className="mt-1 text-xs text-neutral-dark">
                  Opcional. Incluye detalles sobre el contexto, inspiración o proceso creativo de la obra.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/admin/obras')}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              {isEditing ? 'Actualizar Obra' : 'Crear Obra'}
            </Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
};

export default AdminArtworkFormPage;
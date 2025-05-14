import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logWithColor } from '../../utils/debugHelper';
import api from '../../api/apiClient';
import { updateArtwork } from '../../services/adminService';

interface Artwork {
  titulo: string;
  id_artista: string;
  id_categoria: string;
  id_tecnica: string;
  precio: string;
  descripcion: string;
  historia: string;
  anio_creacion: string;
  dimensiones: string;
  disponible: boolean;
  destacado: boolean;
  url_imagen_principal?: string;
}

interface Option {
  id: number;
  nombre: string;
  apellidos?: string;
}

const ArtworkEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [artwork, setArtwork] = useState<Artwork>({
    titulo: '',
    id_artista: '',
    id_categoria: '',
    id_tecnica: '',
    precio: '',
    descripcion: '',
    historia: '',
    anio_creacion: '',
    dimensiones: '',
    disponible: false,
    destacado: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [artists, setArtists] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [techniques, setTechniques] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        logWithColor('info', 'Cargando datos para formulario de edición');

        const [artworkRes, artistsRes, categoriesRes, techniquesRes] = await Promise.all([
          api.get(`/obras/${id}`),
          api.get('/artistas'),
          api.get('/categorias'),
          api.get('/tecnicas')
        ]);

        setArtwork(artworkRes.data.data);
        setArtists(artistsRes.data.data);
        setCategories(categoriesRes.data.data);
        setTechniques(techniquesRes.data.data);

        const image = artworkRes.data.data.url_imagen_principal;
        if (image) {
          setImagePreview(
            image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}${image}`
          );
        }

        logWithColor('success', 'Datos cargados correctamente');
        setLoading(false);
      } catch (err) {
        logWithColor('error', 'Error al cargar datos iniciales:', err);
        setError('Error al cargar datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const target = e.target;
  const { name, value, type } = target;

  setArtwork(prev => ({
    ...prev,
    [name]: type === 'checkbox' && target instanceof HTMLInputElement ? target.checked : value
  }));
};


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      logWithColor('info', 'Archivo seleccionado:', selectedFile.name);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      logWithColor('info', 'Iniciando actualización de obra');

      const formData = {
        ...artwork,
        id_artista: parseInt(artwork.id_artista),
        id_categoria: parseInt(artwork.id_categoria),
        id_tecnica: parseInt(artwork.id_tecnica),
        precio: parseFloat(artwork.precio),
        anio_creacion: artwork.anio_creacion ? parseInt(artwork.anio_creacion) : null,
      };

      if (file) {
        (formData as any).imagen = file;
      }

      const result = await updateArtwork(id!, formData, !!file);

      logWithColor('success', 'Obra actualizada correctamente:', result);
      setSuccessMessage('¡La obra se ha actualizado correctamente!');

      setTimeout(() => {
        navigate('/admin/obras');
      }, 2000);
    } catch (err: any) {
      logWithColor('error', 'Error al enviar formulario:', err);
      let errorMessage = 'Ha ocurrido un error al actualizar la obra.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando datos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Obra</h1>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</div>}
      {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">{successMessage}</div>}

      {/* El resto del formulario sigue igual */}
      {/* Puedes seguir usando tu JSX como ya lo tenías, solo cambiando tipos si hay validaciones o props nuevas */}

      {/* Si quieres que te pegue aquí también todo el formulario visual, dímelo y te lo complemento completo */}
    </div>
  );
};

export default ArtworkEditForm;

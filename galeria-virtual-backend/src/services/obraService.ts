import db from '../config/database';
import { ImagenObra, Obra, ObraDetalle } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener todas las obras
export const obtenerObras = async (params: any = {}): Promise<Obra[]> => {
  try {
    // Construir la consulta base
    let query = `
      SELECT o.*, a.nombre AS nombre_artista, a.apellidos AS apellidos_artista,
             c.nombre AS nombre_categoria, t.nombre AS nombre_tecnica
      FROM obras o
      JOIN artistas a ON o.id_artista = a.id
      JOIN categorias c ON o.id_categoria = c.id
      JOIN tecnicas t ON o.id_tecnica = t.id
      WHERE o.activo = TRUE
    `;
    
    const queryParams: any[] = [];
    
    // Filtro por categoría
    if (params.category_id || params.id_categoria) {
      query += ` AND o.id_categoria = ?`;
      queryParams.push(params.category_id || params.id_categoria);
    }
    
    // Filtro por artista
    if (params.artist_id || params.id_artista) {
      query += ` AND o.id_artista = ?`;
      queryParams.push(params.artist_id || params.id_artista);
    }
    
    // Filtro por técnica
    if (params.technique_id || params.id_tecnica) {
      query += ` AND o.id_tecnica = ?`;
      queryParams.push(params.technique_id || params.id_tecnica);
    }
    
    // Filtro por disponibilidad
    if (params.available_only || params.disponibles) {
      query += ` AND o.disponible = TRUE`;
    }
    
    // Filtro por rango de precio
    if (params.min_price || params.precio_min) {
      query += ` AND o.precio >= ?`;
      queryParams.push(params.min_price || params.precio_min);
    }
    
    if (params.max_price || params.precio_max) {
      query += ` AND o.precio <= ?`;
      queryParams.push(params.max_price || params.precio_max);
    }
    
    // Filtro por rango de años
    if (params.year_from || params.anio_desde) {
      query += ` AND o.anio_creacion >= ?`;
      queryParams.push(params.year_from || params.anio_desde);
    }
    
    if (params.year_to || params.anio_hasta) {
      query += ` AND o.anio_creacion <= ?`;
      queryParams.push(params.year_to || params.anio_hasta);
    }
    
    // Filtro por término de búsqueda
    if (params.search_term || params.termino) {
      query += ` AND (
        o.titulo LIKE ? OR
        o.descripcion LIKE ? OR
        a.nombre LIKE ? OR
        a.apellidos LIKE ? OR
        c.nombre LIKE ? OR
        t.nombre LIKE ?
      )`;
      
      const term = `%${params.search_term || params.termino}%`;
      queryParams.push(term, term, term, term, term, term);
    }
    
    // Ordenamiento
    let orderBy = ' ORDER BY o.destacado DESC, o.fecha_creacion DESC';
    
    if (params.sort_by || params.ordenar) {
      const sortValue = params.sort_by || params.ordenar;
      switch (sortValue) {
        case 'newest':
        case 'fecha_desc':
          orderBy = ' ORDER BY o.fecha_creacion DESC';
          break;
        case 'oldest':
        case 'fecha_asc':
          orderBy = ' ORDER BY o.fecha_creacion ASC';
          break;
        case 'price_asc':
        case 'precio_asc':
          orderBy = ' ORDER BY o.precio ASC';
          break;
        case 'price_desc':
        case 'precio_desc':
          orderBy = ' ORDER BY o.precio DESC';
          break;
        case 'title_asc':
        case 'titulo_asc':
          orderBy = ' ORDER BY o.titulo ASC';
          break;
        case 'title_desc':
        case 'titulo_desc':
          orderBy = ' ORDER BY o.titulo DESC';
          break;
        default:
          break;
      }
    }
    
    query += orderBy;
    
    // Ejecutar la consulta
    console.log('SQL Query:', query);
    console.log('SQL Params:', queryParams);
    
    return await db.query<Obra[]>(query, queryParams);
  } catch (error) {
    logger.error('Error al obtener obras:', error);
    throw error;
  }
};

// Obtener obras destacadas
export const obtenerObrasDestacadas = async (): Promise<Obra[]> => {
  try {
    const query = `
      SELECT o.*, a.nombre AS nombre_artista, a.apellidos AS apellidos_artista,
             c.nombre AS nombre_categoria, t.nombre AS nombre_tecnica
      FROM obras o
      JOIN artistas a ON o.id_artista = a.id
      JOIN categorias c ON o.id_categoria = c.id
      JOIN tecnicas t ON o.id_tecnica = t.id
      WHERE o.destacado = TRUE AND o.disponible = TRUE AND o.activo = TRUE
      ORDER BY o.fecha_creacion DESC
      LIMIT 10
    `;
    
    return await db.query<Obra[]>(query);
  } catch (error) {
    logger.error('Error al obtener obras destacadas:', error);
    throw error;
  }
};

// Obtener obras por categoría
export const obtenerObrasPorCategoria = async (categoriaId: number, soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    return await db.procedure<Obra[]>('sp_obtener_obras_por_categoria', [categoriaId, soloDisponibles]);
  } catch (error) {
    logger.error(`Error al obtener obras de categoría ${categoriaId}:`, error);
    throw error;
  }
};

// Obtener obras por artista
export const obtenerObrasPorArtista = async (artistaId: number, soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    return await db.procedure<Obra[]>('sp_obtener_obras_por_artista', [artistaId, soloDisponibles]);
  } catch (error) {
    logger.error(`Error al obtener obras del artista ${artistaId}:`, error);
    throw error;
  }
};

// Buscar obras
export const buscarObras = async (termino: string, soloDisponibles: boolean = false): Promise<Obra[]> => {
  try {
    return await db.procedure<Obra[]>('sp_buscar_obras', [termino, soloDisponibles]);
  } catch (error) {
    logger.error(`Error al buscar obras con término "${termino}":`, error);
    throw error;
  }
};

// Obtener detalle de una obra
export const obtenerDetalleObra = async (identificador: string, esCodigoQr: boolean = false): Promise<ObraDetalle | null> => {
  try {
    // Verificar primero si la obra existe antes de intentar registrar visita
    let obraId: number;
    
    if (esCodigoQr) {
      const query = "SELECT id FROM obras WHERE codigo_qr = ? AND activo = TRUE";
      const obras = await db.query<Obra[]>(query, [identificador]);
      if (obras.length === 0) return null;
      obraId = obras[0].id!;
    } else {
      obraId = parseInt(identificador);
      const query = "SELECT id FROM obras WHERE id = ? AND activo = TRUE";
      const obras = await db.query<Obra[]>(query, [obraId]);
      if (obras.length === 0) return null;
    }
    
    // Incrementar contador de visitas sin registrar en la tabla visitas
    const updateQuery = "UPDATE obras SET visitas = visitas + 1 WHERE id = ?";
    await db.query(updateQuery, [obraId]);
    
    // Obtener detalles de la obra
    const detalleQuery = `
      SELECT o.*,
             a.nombre AS nombre_artista,
             a.apellidos AS apellidos_artista,
             a.biografia AS biografia_artista,
             c.nombre AS nombre_categoria,
             t.nombre AS nombre_tecnica,
             o.visitas AS total_visitas
      FROM obras o
      JOIN artistas a ON o.id_artista = a.id
      JOIN categorias c ON o.id_categoria = c.id
      JOIN tecnicas t ON o.id_tecnica = t.id
      WHERE o.id = ? AND o.activo = TRUE
    `;
    
    const obras = await db.query<ObraDetalle[]>(detalleQuery, [obraId]);
    
    if (obras.length === 0) return null;
    
    // Obtener imágenes adicionales
    const imagenesQuery = `
      SELECT * FROM imagenes_obras 
      WHERE id_obra = ? AND activo = TRUE
      ORDER BY es_principal DESC, fecha_creacion ASC
    `;
    
    const imagenes = await db.query<ImagenObra[]>(imagenesQuery, [obraId]);
    obras[0].imagenes = imagenes;
    
    return obras[0];
  } catch (error) {
    logger.error(`Error al obtener detalle de obra ${identificador}:`, error);
    throw error;
  }
};

// Crear una nueva obra
export const crearObra = async (obra: Partial<Obra>): Promise<Obra> => {
  try {
    const resultado = await db.procedure<any>('sp_agregar_obra', [
      obra.titulo,
      obra.id_artista,
      obra.id_categoria,
      obra.id_tecnica,
      obra.anio_creacion || null,
      obra.dimensiones || null,
      obra.precio,
      obra.descripcion,
      obra.historia || null,
      obra.url_imagen_principal,
      null // OUT parámetro
    ]);
    
    // El procedimiento devuelve el ID de la obra creada
    const obraId = resultado.p_id_obra;
    
    // Obtener la obra completa
    const query = `
      SELECT * FROM obras WHERE id = ?
    `;
    const obras = await db.query<Obra[]>(query, [obraId]);
    
    if (obras.length === 0) {
      throw new Error('Error al recuperar la obra creada');
    }
    
    return obras[0];
  } catch (error) {
    logger.error('Error al crear obra:', error);
    throw error;
  }
};

// Actualizar URL del código QR de una obra
export const actualizarQRObra = async (obraId: number, qrUrl: string): Promise<boolean> => {
  try {
    const query = `
      UPDATE obras SET codigo_qr = ? WHERE id = ?
    `;
    
    await db.query(query, [qrUrl, obraId]);
    return true;
  } catch (error) {
    logger.error(`Error al actualizar QR de obra ${obraId}:`, error);
    throw error;
  }
};

// Actualizar una obra
export const actualizarObra = async (obraId: number, datosObra: Partial<Obra>): Promise<Obra | null> => {
  try {
    // Primero verificar si la obra existe
    const obraExistente = await obtenerDetalleObra(obraId.toString());
    
    if (!obraExistente) {
      return null;
    }
    
    // Construir la consulta dinámica
    let query = 'UPDATE obras SET ';
    const params = [];
    
    // Agregar cada campo a actualizar
    Object.entries(datosObra).forEach(([key, value], index) => {
      // Omitir campos que no se deben actualizar directamente
      if (!['id', 'codigo_qr', 'fecha_creacion', 'fecha_actualizacion', 'activo'].includes(key)) {
        query += `${key} = ?${index < Object.keys(datosObra).length - 1 ? ', ' : ''}`;
        params.push(value);
      }
    });
    
    // Agregar condición WHERE y fecha de actualización
    query += ', fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    params.push(obraId);
    
    // Ejecutar la actualización
    await db.query(query, params);
    
    // Devolver la obra actualizada
    return await obtenerDetalleObra(obraId.toString()) as ObraDetalle;
  } catch (error) {
    logger.error(`Error al actualizar obra ${obraId}:`, error);
    throw error;
  }
};

// Actualizar estado de disponibilidad/destacado
export const actualizarEstadoObra = async (obraId: number, disponible?: boolean, destacado?: boolean): Promise<boolean> => {
  try {
    // Primero verificar si la obra existe
    const query = 'SELECT id FROM obras WHERE id = ? AND activo = TRUE';
    const obras = await db.query<Obra[]>(query, [obraId]);
    
    if (obras.length === 0) {
      return false;
    }
    
    // Si se proporcionaron valores para disponible o destacado
    if (disponible !== undefined || destacado !== undefined) {
      await db.procedure('sp_actualizar_estado_obra', [
        obraId,
        disponible !== undefined ? disponible : obras[0].disponible,
        destacado !== undefined ? destacado : obras[0].destacado
      ]);
    }
    
    return true;
  } catch (error) {
    logger.error(`Error al actualizar estado de obra ${obraId}:`, error);
    throw error;
  }
};

export const registrarVisita = async (obraId: number, ipVisitante?: string): Promise<boolean> => {
  try {
    // Primero verificar si la obra existe
    const query = "SELECT id FROM obras WHERE id = ? AND activo = TRUE";
    const obras = await db.query<Obra[]>(query, [obraId]);
    
    if (obras.length === 0) {
      return false;
    }
    
    // Incrementar contador en obras
    const updateQuery = "UPDATE obras SET visitas = visitas + 1 WHERE id = ?";
    await db.query(updateQuery, [obraId]);
    
    // Intentar registrar en tabla visitas
    try {
      const insertQuery = "INSERT INTO visitas (id_obra, ip_visitante) VALUES (?, ?)";
      await db.query(insertQuery, [obraId, ipVisitante || null]);
    } catch (error) {
      // Si falla la inserción en visitas, solo lo registramos pero no interrumpimos
      logger.warn(`No se pudo registrar en tabla visitas para obra ${obraId}:`, error);
    }
    
    return true;
  } catch (error) {
    logger.error(`Error al registrar visita para obra ${obraId}:`, error);
    return false;
  }
};

// Eliminar una obra (soft delete)
export const eliminarObra = async (obraId: number): Promise<boolean> => {
  try {
    // Primero verificar si la obra existe
    const query = 'SELECT id FROM obras WHERE id = ? AND activo = TRUE';
    const obras = await db.query<Obra[]>(query, [obraId]);
    
    if (obras.length === 0) {
      return false;
    }
    
    // Soft delete
    const updateQuery = 'UPDATE obras SET activo = FALSE, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(updateQuery, [obraId]);
    
    return true;
  } catch (error) {
    logger.error(`Error al eliminar obra ${obraId}:`, error);
    throw error;
  }
};

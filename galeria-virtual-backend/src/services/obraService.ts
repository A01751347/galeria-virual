import db from '../config/database';
import { ImagenObra, Obra, ObraDetalle } from '../models/tipos';
import { logger } from '../utils/logger';

// Obtener todas las obras
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
    
    // Filtros dinámicos
    if (params.category_id || params.id_categoria) {
      query += ` AND o.id_categoria = ?`;
      queryParams.push(params.category_id || params.id_categoria);
    }
    if (params.artist_id || params.id_artista) {
      query += ` AND o.id_artista = ?`;
      queryParams.push(params.artist_id || params.id_artista);
    }
    if (params.technique_id || params.id_tecnica) {
      query += ` AND o.id_tecnica = ?`;
      queryParams.push(params.technique_id || params.id_tecnica);
    }
    if (params.available_only || params.disponibles) {
      query += ` AND o.disponible = TRUE`;
    }
    if (params.min_price || params.precio_min) {
      query += ` AND o.precio >= ?`;
      queryParams.push(params.min_price || params.precio_min);
    }
    if (params.max_price || params.precio_max) {
      query += ` AND o.precio <= ?`;
      queryParams.push(params.max_price || params.precio_max);
    }
    if (params.year_from || params.anio_desde) {
      query += ` AND o.anio_creacion >= ?`;
      queryParams.push(params.year_from || params.anio_desde);
    }
    if (params.year_to || params.anio_hasta) {
      query += ` AND o.anio_creacion <= ?`;
      queryParams.push(params.year_to || params.anio_hasta);
    }
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
        case 'fecha_desc': orderBy = ' ORDER BY o.fecha_creacion DESC'; break;
        case 'oldest':
        case 'fecha_asc':  orderBy = ' ORDER BY o.fecha_creacion ASC';  break;
        case 'price_asc':
        case 'precio_asc': orderBy = ' ORDER BY o.precio ASC';         break;
        case 'price_desc':
        case 'precio_desc':orderBy = ' ORDER BY o.precio DESC';        break;
        case 'title_asc':
        case 'titulo_asc': orderBy = ' ORDER BY o.titulo ASC';         break;
        case 'title_desc':
        case 'titulo_desc':orderBy = ' ORDER BY o.titulo DESC';        break;
        default: break;
      }
    }
    query += orderBy;
    
    console.debug('SQL Query:', query);
    console.debug('SQL Params:', queryParams);
    
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
// En src/services/obraService.ts
// En src/services/obraService.ts
export const crearObra = async (obra: Partial<Obra>): Promise<Obra> => {
  try {
    // Generar código QR aleatorio
    const codigoQR = 'OBR' + 
      String(Math.floor(Math.random() * 9999)).padStart(4, '0') +
      Math.random().toString(36).substring(2, 5).toUpperCase();
    
    // Consulta SQL directa en lugar de procedimiento almacenado
    const query = `
      INSERT INTO obras (
        titulo,
        id_artista,
        id_categoria,
        id_tecnica,
        anio_creacion,
        dimensiones,
        precio,
        descripcion,
        historia,
        url_imagen_principal,
        codigo_qr,
        disponible,
        destacado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, FALSE)
    `;
    
    // Parámetros directos
    const params = [
      obra.titulo || '',                              // titulo
      obra.id_artista || 0,                           // id_artista
      obra.id_categoria || 0,                         // id_categoria
      obra.id_tecnica || 0,                           // id_tecnica
      obra.anio_creacion === undefined ? null : obra.anio_creacion,  // anio_creacion
      obra.dimensiones || null,                       // dimensiones
      obra.precio || 0,                               // precio
      obra.descripcion || '',                         // descripcion
      obra.historia || null,                          // historia
      obra.url_imagen_principal || '',                // url_imagen_principal
      codigoQR                                        // codigo_qr
    ];
    
    logger.info('Ejecutando query directa con parámetros:', params);
    
    // Ejecutar la consulta
    const result = await db.query<any>(query, params);
    
    // Obtener el ID de la obra insertada
    const obraId = (result as any).insertId;
    
    // Obtener la obra completa
    const selectQuery = `SELECT * FROM obras WHERE id = ?`;
    const obras = await db.query<Obra[]>(selectQuery, [obraId]);
    
    if (obras.length === 0) {
      throw new Error('Error al recuperar la obra creada');
    }
    
    return obras[0];
  } catch (error) {
    logger.error('Error al crear obra (detallado):', error);
    if (error instanceof Error) {
      logger.error('Stack trace:', error.stack);
    }
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

export const actualizarObra = async (
  obraId: number,
  datosObra: Partial<Obra>
): Promise<Obra | null> => {
  try {
    // Verificar existencia
    const existing = await obtenerDetalleObra(obraId.toString());
    if (!existing) return null;

    // Excluir estos campos siempre
    const excluded = ['id', 'codigo_qr', 'fecha_creacion', 'fecha_actualizacion', 'activo'];

    // Filtrar entradas definidas y no excluidas
    const entries = Object.entries(datosObra).filter(
      ([key, val]) => val !== undefined && !excluded.includes(key)
    );

    if (entries.length === 0) {
      return existing;
    }

    const fields = entries.map(([key]) => `${key} = ?`);
    const params = entries.map(([, val]) => val);
    
    // Agregar timestamp y condicion
    params.push(obraId);
    const query = `
      UPDATE obras SET
      ${fields.join(', ')},
      fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    console.debug('Update Query:', query.trim());
    console.debug('Params:', params);

    const result: any = await db.query(query, params);
    if (result.affectedRows === 0) return null;

    return await obtenerDetalleObra(obraId.toString());
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

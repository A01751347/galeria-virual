-- Esquema de base de datos para Galería Virtual

-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS galeria_virtual;

-- Crear base de datos
CREATE DATABASE galeria_virtual CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos creada
USE galeria_virtual;

-- Tabla de Artistas
CREATE TABLE artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    biografia TEXT,
    email VARCHAR(100),
    telefono VARCHAR(20),
    sitio_web VARCHAR(255),
    fecha_nacimiento DATE,
    nacionalidad VARCHAR(50),
    url_imagen VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de Categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de Técnicas
CREATE TABLE tecnicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de Obras
CREATE TABLE obras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    id_artista INT NOT NULL,
    id_categoria INT NOT NULL,
    id_tecnica INT NOT NULL,
    anio_creacion INT,
    dimensiones VARCHAR(100),
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    historia TEXT,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    url_imagen_principal VARCHAR(255) NOT NULL,
    codigo_qr VARCHAR(255),
    visitas INT NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_artista) REFERENCES artistas(id),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id),
    FOREIGN KEY (id_tecnica) REFERENCES tecnicas(id)
);

-- Tabla de Imágenes de Obras
CREATE TABLE imagenes_obras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_obra INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    titulo VARCHAR(150),
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_obra) REFERENCES obras(id)
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de Consultas/Ofertas
CREATE TABLE consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_obra INT NOT NULL,
    id_usuario INT,
    nombre VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT NOT NULL,
    es_oferta BOOLEAN NOT NULL DEFAULT FALSE,
    monto_oferta DECIMAL(10, 2),
    estado ENUM('pendiente', 'respondida', 'aceptada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_obra) REFERENCES obras(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de Ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_obra INT NOT NULL,
    id_usuario INT,
    nombre_comprador VARCHAR(150),
    email_comprador VARCHAR(100) NOT NULL,
    telefono_comprador VARCHAR(20),
    precio_venta DECIMAL(10, 2) NOT NULL,
    comision DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(100),
    estado ENUM('pendiente', 'pagado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    notas TEXT,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_obra) REFERENCES obras(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de Favoritos
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_obra INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorito (id_usuario, id_obra),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_obra) REFERENCES obras(id)
);

-- Tabla de Visitas
CREATE TABLE visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_obra INT NOT NULL,
    ip_visitante VARCHAR(45),
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_obra) REFERENCES obras(id)
);

-- Tabla de Sesiones
CREATE TABLE sesiones (
    id VARCHAR(36) PRIMARY KEY,
    id_usuario INT NOT NULL,
    datos JSON,
    ip_usuario VARCHAR(45),
    user_agent TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Procedimientos almacenados
DELIMITER //

-- Procedimiento para registrar consulta
CREATE PROCEDURE sp_registrar_consulta(
    IN p_id_obra INT,
    IN p_id_usuario INT,
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_mensaje TEXT,
    IN p_es_oferta BOOLEAN,
    IN p_monto_oferta DECIMAL(10, 2),
    OUT p_id_consulta INT
)
BEGIN
    INSERT INTO consultas (
        id_obra, 
        id_usuario, 
        nombre, 
        email, 
        telefono, 
        mensaje, 
        es_oferta, 
        monto_oferta
    ) VALUES (
        p_id_obra, 
        p_id_usuario, 
        p_nombre, 
        p_email, 
        p_telefono, 
        p_mensaje, 
        p_es_oferta, 
        p_monto_oferta
    );
    
    SET p_id_consulta = LAST_INSERT_ID();
    
    -- Obtener información adicional para devolver
    SELECT 
        c.*,
        o.titulo AS titulo_obra,
        a.nombre AS nombre_artista,
        a.apellidos AS apellidos_artista
    FROM consultas c
    JOIN obras o ON c.id_obra = o.id
    JOIN artistas a ON o.id_artista = a.id
    WHERE c.id = p_id_consulta;
END //

-- Procedimiento para agregar obra
CREATE PROCEDURE sp_agregar_obra(
    IN p_titulo VARCHAR(150),
    IN p_id_artista INT,
    IN p_id_categoria INT,
    IN p_id_tecnica INT,
    IN p_anio_creacion INT,
    IN p_dimensiones VARCHAR(100),
    IN p_precio DECIMAL(10, 2),
    IN p_descripcion TEXT,
    IN p_historia TEXT,
    IN p_url_imagen_principal VARCHAR(255),
    OUT p_id_obra INT
)
BEGIN
    -- Generar código QR aleatorio
    DECLARE v_codigo_qr VARCHAR(10);
    SET v_codigo_qr = CONCAT(
        'OBR',
        LPAD(FLOOR(RAND() * 9999), 4, '0'),
        UPPER(LEFT(UUID(), 3))
    );
    
    -- Insertar obra
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
        codigo_qr
    ) VALUES (
        p_titulo,
        p_id_artista,
        p_id_categoria,
        p_id_tecnica,
        p_anio_creacion,
        p_dimensiones,
        p_precio,
        p_descripcion,
        p_historia,
        p_url_imagen_principal,
        v_codigo_qr
    );
    
    SET p_id_obra = LAST_INSERT_ID();
END //

-- Procedimiento para obtener obras por categoría
CREATE PROCEDURE sp_obtener_obras_por_categoria(
    IN p_id_categoria INT,
    IN p_solo_disponibles BOOLEAN
)
BEGIN
    SELECT o.*, 
           a.nombre AS nombre_artista, 
           a.apellidos AS apellidos_artista,
           c.nombre AS nombre_categoria, 
           t.nombre AS nombre_tecnica
    FROM obras o
    JOIN artistas a ON o.id_artista = a.id
    JOIN categorias c ON o.id_categoria = c.id
    JOIN tecnicas t ON o.id_tecnica = t.id
    WHERE o.id_categoria = p_id_categoria 
      AND o.activo = TRUE
      AND (p_solo_disponibles = FALSE OR o.disponible = TRUE)
    ORDER BY o.destacado DESC, o.fecha_creacion DESC;
END //

-- Procedimiento para obtener obras por artista
CREATE PROCEDURE sp_obtener_obras_por_artista(
    IN p_id_artista INT,
    IN p_solo_disponibles BOOLEAN
)
BEGIN
    SELECT o.*, 
           a.nombre AS nombre_artista, 
           a.apellidos AS apellidos_artista,
           c.nombre AS nombre_categoria, 
           t.nombre AS nombre_tecnica
    FROM obras o
    JOIN artistas a ON o.id_artista = a.id
    JOIN categorias c ON o.id_categoria = c.id
    JOIN tecnicas t ON o.id_tecnica = t.id
    WHERE o.id_artista = p_id_artista 
      AND o.activo = TRUE
      AND (p_solo_disponibles = FALSE OR o.disponible = TRUE)
    ORDER BY o.destacado DESC, o.fecha_creacion DESC;
END //

-- Procedimiento para buscar obras
CREATE PROCEDURE sp_buscar_obras(
    IN p_termino VARCHAR(100),
    IN p_solo_disponibles BOOLEAN
)
BEGIN
    SELECT o.*, 
           a.nombre AS nombre_artista, 
           a.apellidos AS apellidos_artista,
           c.nombre AS nombre_categoria, 
           t.nombre AS nombre_tecnica
    FROM obras o
    JOIN artistas a ON o.id_artista = a.id
    JOIN categorias c ON o.id_categoria = c.id
    JOIN tecnicas t ON o.id_tecnica = t.id
    WHERE o.activo = TRUE
      AND (p_solo_disponibles = FALSE OR o.disponible = TRUE)
      AND (
          o.titulo LIKE CONCAT('%', p_termino, '%') OR
          o.descripcion LIKE CONCAT('%', p_termino, '%') OR
          a.nombre LIKE CONCAT('%', p_termino, '%') OR
          a.apellidos LIKE CONCAT('%', p_termino, '%') OR
          c.nombre LIKE CONCAT('%', p_termino, '%') OR
          t.nombre LIKE CONCAT('%', p_termino, '%')
      )
    ORDER BY o.destacado DESC, o.fecha_creacion DESC;
END //

-- Procedimiento para obtener detalle de obra
CREATE PROCEDURE sp_obtener_detalle_obra(
    IN p_identificador VARCHAR(36),
    IN p_es_codigo_qr BOOLEAN
)
BEGIN
    DECLARE v_id_obra INT;
    
    -- Determinar el ID de la obra según el tipo de identificador
    IF p_es_codigo_qr = TRUE THEN
        SELECT id INTO v_id_obra FROM obras WHERE codigo_qr = p_identificador AND activo = TRUE LIMIT 1;
    ELSE
        SET v_id_obra = CAST(p_identificador AS UNSIGNED);
    END IF;
    
    -- Incrementar contador de visitas
    IF v_id_obra IS NOT NULL THEN
        UPDATE obras SET visitas = visitas + 1 WHERE id = v_id_obra;
        
        -- Registrar visita
        INSERT INTO visitas (id_obra) VALUES (v_id_obra);
    END IF;
    
    -- Obtener detalle de la obra
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
    WHERE o.id = v_id_obra AND o.activo = TRUE;
    
    -- Obtener imágenes adicionales
    SELECT * FROM imagenes_obras 
    WHERE id_obra = v_id_obra AND activo = TRUE
    ORDER BY es_principal DESC, fecha_creacion ASC;
END //

-- Procedimiento para registrar venta
CREATE PROCEDURE sp_registrar_venta(
    IN p_id_obra INT,
    IN p_id_usuario INT,
    IN p_nombre_comprador VARCHAR(150),
    IN p_email_comprador VARCHAR(100),
    IN p_telefono_comprador VARCHAR(20),
    IN p_metodo_pago VARCHAR(50),
    IN p_referencia_pago VARCHAR(100),
    IN p_notas TEXT,
    OUT p_id_venta INT
)
BEGIN
    DECLARE v_precio DECIMAL(10, 2);
    DECLARE v_comision DECIMAL(10, 2);
    
    -- Obtener precio de la obra
    SELECT precio INTO v_precio FROM obras WHERE id = p_id_obra;
    
    -- Calcular comisión (20%)
    SET v_comision = v_precio * 0.20;
    
    -- Insertar venta
    INSERT INTO ventas (
        id_obra,
        id_usuario,
        nombre_comprador,
        email_comprador,
        telefono_comprador,
        precio_venta,
        comision,
        metodo_pago,
        referencia_pago,
        notas
    ) VALUES (
        p_id_obra,
        p_id_usuario,
        p_nombre_comprador,
        p_email_comprador,
        p_telefono_comprador,
        v_precio,
        v_comision,
        p_metodo_pago,
        p_referencia_pago,
        p_notas
    );
    
    SET p_id_venta = LAST_INSERT_ID();
END //

-- Procedimiento para actualizar estado de obra
CREATE PROCEDURE sp_actualizar_estado_obra(
    IN p_id_obra INT,
    IN p_disponible BOOLEAN,
    IN p_destacado BOOLEAN
)
BEGIN
    UPDATE obras 
    SET disponible = p_disponible,
        destacado = p_destacado,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = p_id_obra;
END //

-- Procedimiento para obtener estadísticas
CREATE PROCEDURE sp_obtener_estadisticas()
BEGIN
    -- Total obras
    SELECT COUNT(*) INTO @total_obras FROM obras WHERE activo = TRUE;
    
    -- Obras disponibles
    SELECT COUNT(*) INTO @obras_disponibles FROM obras WHERE disponible = TRUE AND activo = TRUE;
    
    -- Obras vendidas
    SELECT COUNT(*) INTO @obras_vendidas FROM ventas WHERE estado IN ('pagado', 'entregado');
    
    -- Total consultas
    SELECT COUNT(*) INTO @total_consultas FROM consultas WHERE activo = TRUE;
    
    -- Total ofertas
    SELECT COUNT(*) INTO @total_ofertas FROM consultas WHERE es_oferta = TRUE AND activo = TRUE;
    
    -- Total clientes
    SELECT COUNT(*) INTO @total_clientes FROM usuarios WHERE rol = 'cliente' AND activo = TRUE;
    
    -- Ingresos totales
    SELECT COALESCE(SUM(precio_venta), 0) INTO @ingresos_totales 
    FROM ventas 
    WHERE estado IN ('pagado', 'entregado');
    
    -- Comisiones totales
    SELECT COALESCE(SUM(comision), 0) INTO @comisiones_totales 
    FROM ventas 
    WHERE estado IN ('pagado', 'entregado');
    
    -- Devolver resultados
    SELECT 
        @total_obras AS total_obras,
        @obras_disponibles AS obras_disponibles,
        @obras_vendidas AS obras_vendidas,
        @total_consultas AS total_consultas,
        @total_ofertas AS total_ofertas,
        @total_clientes AS total_clientes,
        @ingresos_totales AS ingresos_totales,
        @comisiones_totales AS comisiones_totales;
END //

DELIMITER ;

-- Insertar datos de prueba
-- Categorías
INSERT INTO categorias (nombre, descripcion) VALUES 
('Pintura', 'Todo tipo de obras pintadas, incluyendo óleos, acrílicos, acuarelas, etc.'),
('Escultura', 'Obras tridimensionales creadas mediante tallado, modelado o ensamblaje'),
('Fotografía', 'Imágenes capturadas a través de medios fotográficos'),
('Dibujo', 'Creaciones realizadas principalmente con lápiz, carboncillo, tinta, etc.'),
('Arte Digital', 'Obras creadas o manipuladas utilizando tecnología digital'),
('Grabado', 'Obras realizadas mediante técnicas de impresión como xilografía, litografía, etc.');

-- Técnicas
INSERT INTO tecnicas (nombre, descripcion) VALUES 
('Óleo', 'Pintura de secado lento que consiste en pigmentos molidos mezclados con aceites'),
('Acrílico', 'Pintura de secado rápido que consiste en pigmento suspendido en emulsión acrílica'),
('Acuarela', 'Pintura que utiliza pigmentos transparentes diluidos en agua'),
('Pastel', 'Medio artístico en forma de barra con pigmento puro y aglutinante'),
('Carboncillo', 'Medio de dibujo utilizando palos de carbón'),
('Mármol', 'Escultura realizada en piedra de mármol'),
('Bronce', 'Escultura realizada por fundición en bronce'),
('Madera', 'Escultura tallada en madera'),
('Cerámica', 'Obras realizadas con arcilla y endurecidas mediante cocción'),
('Fotografía Digital', 'Fotografía tomada con cámaras digitales'),
('Fotografía Analógica', 'Fotografía tradicional utilizando película'),
('Arte Generativo', 'Arte creado con el uso de algoritmos autónomos');

-- Crear usuario admin
INSERT INTO usuarios (nombre, apellidos, email, contrasena, rol, activo) VALUES 
('Admin', 'Galería', 'admin@galeriavirtual.com', '$2a$10$uK.MhhB8o1y4JdpKtR.zdeXv8gYLLBJbMcQK2Ml9Xr25kzCwXZf/y', 'admin', TRUE);
-- contraseña: Admin123$
// src/config/database.ts
import mysql from 'mysql2/promise';
import { logger } from '../utils/logger';

const {
  DB_HOST = 'localhost',
  DB_USER = 'usuario_galeria',
  DB_PASS = 'password_segura',
  DB_NAME = 'galeria_virtual',
  DB_PORT = '3306'
} = process.env;

// Crear pool de conexiones
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: parseInt(DB_PORT, 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión
const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    logger.info('Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    logger.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar una consulta
const query = async <T>(sql: string, params: any[] = []): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    logger.error('Error al ejecutar consulta SQL:', error);
    throw error;
  }
};

// Ejecutar un procedimiento almacenado
const procedure = async <T>(name: string, params: any[] = []): Promise<T> => {
  try {
    const placeholders = params.map(() => '?').join(',');
    const sql = `CALL ${name}(${placeholders})`;
    const [rows] = await pool.execute(sql, params);
    return (Array.isArray(rows) && rows.length > 0 ? rows[0] : rows) as T;
  } catch (error) {
    logger.error(`Error al ejecutar procedimiento ${name}:`, error);
    throw error;
  }
};

// Realizar una transacción
const transaction = async <T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  pool,
  testConnection,
  query,
  procedure,
  transaction
};
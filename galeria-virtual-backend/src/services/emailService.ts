import nodemailer from 'nodemailer';
import { Consulta, Venta } from '../models/tipos';
import { logger } from '../utils/logger';

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Verificar conexión al iniciar
export const verificarConexion = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info('Conexión con servidor de email establecida');
    return true;
  } catch (error) {
    logger.error('Error al conectar con servidor de email:', error);
    return false;
  }
};

// Enviar notificación de nueva consulta al administrador
export const enviarNotificacionNuevaConsulta = async (consulta: Consulta): Promise<void> => {
  try {
    const emailAdmin = process.env.EMAIL_FROM || '';
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '',
      to: emailAdmin,
      subject: consulta.es_oferta ? 'Nueva oferta recibida - Galería Virtual' : 'Nueva consulta recibida - Galería Virtual',
      html: `
        <h2>${consulta.es_oferta ? 'Nueva oferta recibida' : 'Nueva consulta recibida'}</h2>
        <p><strong>Obra:</strong> ${consulta.titulo_obra || `ID: ${consulta.id_obra}`}</p>
        <p><strong>De:</strong> ${consulta.nombre || 'No especificado'} (${consulta.email})</p>
        <p><strong>Teléfono:</strong> ${consulta.telefono || 'No especificado'}</p>
        ${consulta.es_oferta ? `<p><strong>Monto ofertado:</strong> $${consulta.monto_oferta?.toLocaleString()}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${consulta.mensaje}</p>
        <p><a href="${process.env.FRONTEND_URL}/admin/consultas">Ver en el panel de administración</a></p>
      `
    });
  } catch (error) {
    logger.error('Error al enviar notificación de nueva consulta:', error);
    throw error;
  }
};

// Enviar respuesta a consulta
export const enviarRespuestaConsulta = async (consulta: Consulta, respuesta: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '',
      to: consulta.email,
      subject: consulta.es_oferta ? 'Respuesta a su oferta - Galería Virtual' : 'Respuesta a su consulta - Galería Virtual',
      html: `
        <h2>${consulta.es_oferta ? 'Respuesta a su oferta' : 'Respuesta a su consulta'}</h2>
        <p>Estimado/a ${consulta.nombre || consulta.email},</p>
        <p>Gracias por su ${consulta.es_oferta ? 'oferta' : 'consulta'} sobre la obra "${consulta.titulo_obra || `ID: ${consulta.id_obra}`}".</p>
        <p><strong>Su mensaje:</strong></p>
        <p><em>${consulta.mensaje}</em></p>
        <p><strong>Nuestra respuesta:</strong></p>
        <p>${respuesta}</p>
        <p>Saludos cordiales,</p>
        <p>Equipo de Galería Virtual</p>
      `
    });
  } catch (error) {
    logger.error('Error al enviar respuesta a consulta:', error);
    throw error;
  }
};

// Enviar confirmación de venta
export const enviarConfirmacionVenta = async (venta: Venta): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '',
      to: venta.email_comprador,
      subject: 'Confirmación de Compra - Galería Virtual',
      html: `
        <h2>Confirmación de Compra</h2>
        <p>Estimado/a ${venta.nombre_comprador || venta.email_comprador},</p>
        <p>¡Gracias por su compra! Nos complace confirmarle que su adquisición de obra de arte ha sido registrada exitosamente.</p>
        <p><strong>Detalles de la compra:</strong></p>
        <ul>
          <li><strong>Obra:</strong> ${venta.titulo_obra || `ID: ${venta.id_obra}`}</li>
          <li><strong>Precio:</strong> $${venta.precio_venta.toLocaleString()}</li>
          <li><strong>Método de pago:</strong> ${venta.metodo_pago || 'No especificado'}</li>
          <li><strong>Referencia de pago:</strong> ${venta.referencia_pago || 'No especificado'}</li>
          <li><strong>Estado:</strong> ${venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}</li>
        </ul>
        <p>En breve nos pondremos en contacto con usted para coordinar la entrega de la obra.</p>
        <p>Saludos cordiales,</p>
        <p>Equipo de Galería Virtual</p>
      `
    });
  } catch (error) {
    logger.error('Error al enviar confirmación de venta:', error);
    throw error;
  }
};

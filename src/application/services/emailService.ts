import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import ClimaService from './climaService';
import AccionService from './accionService';
import RegistroService from './registroService';
import { RegistroSemanalDTO } from '../../domain/DTO/RegistroSemanalDTO';

dotenv.config();

class EmailService {
  private climaService: ClimaService;
  private accionService: AccionService;
  private registroService: RegistroService;

  constructor(
    climaService: ClimaService,
    accionService: AccionService,
    registroService: RegistroService
  ) {
    this.climaService = climaService;
    this.accionService = accionService;
    this.registroService = registroService;
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('SENDGRID_API_KEY no está configurada. Los correos no se enviarán.');
    } else {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const msg = {
      to,
      from: 'dhuerta@hackmetrix.com', // Email verificado en SendGrid
      subject,
      text,
      html: html || text,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Email enviado exitosamente a ${to}`);
    } catch (error: any) {
      console.error('❌ Error al enviar email:', error);
      if (error.response && error.response.body) {
        console.error('📝 Detalles del error:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  async sendWelcomeEmail(to: string): Promise<void> {
    const subject = 'Bienvenido a la API de Clima';
    const text = `¡Hola! Bienvenido a nuestra API de clima y actividades. ¡Esperamos que disfrutes usando nuestro servicio!`;
    const html = `
      <h1>¡Bienvenido!</h1>
      <p>Gracias por usar nuestra API de clima y actividades.</p>
      <p>Con nuestra API puedes:</p>
      <ul>
        <li>Obtener el clima actual de cualquier ciudad</li>
        <li>Recibir recomendaciones de actividades según el clima</li>
        <li>Registrar y gestionar tus actividades</li>
      </ul>
      <p>¡Que tengas un excelente día!</p>
    `;

    await this.sendEmail(to, subject, text, html);
  }

  async sendDailySummaryEmail(to: string, ciudad: string): Promise<void> {
    console.log(`--- Preparando resumen diario para ${to} en ${ciudad} ---`);
    const climaActual = await this.climaService.obtenerClimaActual(ciudad);
    const { mejores, peores } = await this.accionService.obtenerTopAccionesPorClima(climaActual, 3);

    const subject = `Panoramas recomendados para hoy en ${ciudad}`;
    const html = `
      <h2>Panoramas recomendados para hoy (${climaActual.nombre})</h2>
      <h3>Mejores acciones:</h3>
      <ul>
        ${mejores.map(a => `<li><b>${a.nombre}</b>: ${a.descripcion} (Puntaje: ${a.puntaje})</li>`).join('')}
      </ul>
      <h3>Acciones menos recomendadas:</h3>
      <ul>
        ${peores.map(a => `<li><b>${a.nombre}</b>: ${a.descripcion} (Puntaje: ${a.puntaje})</li>`).join('')}
      </ul>
    `;

    await this.sendEmail(to, subject, 'Resumen diario de actividades', html);
  }

  async sendWeeklySummaryEmail(to: string): Promise<void> {
    console.log(`--- Preparando resumen semanal para ${to} ---`);
    const weeklyRegistros = await this.registroService.getWeeklyRegistrosGroupedByAccion();

    let emailContent = 'Total de acciones realizadas en esta semana:\n\n';
    if (weeklyRegistros.length === 0) {
      emailContent += 'No se realizaron acciones esta semana.';
    } else {
      weeklyRegistros.forEach((registro: RegistroSemanalDTO) => {
        emailContent += `- ${registro.accionNombre}: ${registro.totalVeces} veces\n`;
      });
    }

    const subject = 'Informe Semanal de Actividades';
    const html = `<p>${emailContent.replace(/\n/g, '<br>')}</p>`;
    await this.sendEmail(to, subject, emailContent, html);
  }
}

export default EmailService;

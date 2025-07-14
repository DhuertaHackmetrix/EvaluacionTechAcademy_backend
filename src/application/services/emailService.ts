import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY no está configurada en las variables de entorno');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    // Modo desarrollo - simular envío solo si no hay API key válida
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
      console.log('📧 [SIMULADOR] Email que se enviaría:');
      console.log(`   Para: ${to}`);
      console.log(`   De: dhuerta@hackmetrix.com`);
      console.log(`   Asunto: ${subject}`);
      console.log(`   Mensaje: ${text}`);
      console.log('✅ Email simulado enviado exitosamente');
      return;
    }

    const msg = {
      to,
      from: 'dhuerta@hackmetrix.com', // Email verificado en SendGrid
      subject,
      text,
      html: html || text,
    };

    try {
      await sgMail.send(msg);
      console.log('✅ Email enviado exitosamente');
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
}

export default EmailService;

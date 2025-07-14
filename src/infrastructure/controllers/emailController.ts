import { Request, Response } from 'express';
import EmailService from '../../application/services/emailService';

class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async sendWelcomeEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'El email es requerido'
        });
        return;
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'El formato del email no es válido'
        });
        return;
      }

      await this.emailService.sendWelcomeEmail(email);

      res.status(200).json({
        success: true,
        message: 'Email de bienvenida enviado exitosamente',
        data: { email }
      });
    } catch (error) {
      console.error('Error en EmailController.sendWelcomeEmail:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al enviar el email',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async sendTestEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, subject, message } = req.body;

      if (!email || !subject || !message) {
        res.status(400).json({
          success: false,
          message: 'Email, subject y message son requeridos'
        });
        return;
      }

      await this.emailService.sendEmail(email, subject, message);

      res.status(200).json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
        data: { email, subject }
      });
    } catch (error) {
      console.error('Error en EmailController.sendTestEmail:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al enviar el email',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}

export default EmailController;

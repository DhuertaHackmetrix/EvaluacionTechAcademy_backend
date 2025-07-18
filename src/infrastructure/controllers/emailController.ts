import { Request, Response } from 'express';
import EmailService from '../../application/services/emailService';
import ClimaService from '../../application/services/climaService';
import AccionService from '../../application/services/accionService';
import RegistroService from '../../application/services/registroService';
import ClimaRepository from '../repositories/ClimaRepository';
import AccionRepository from '../repositories/AccionRepository';
import RegistroRepository from '../repositories/RegistroRepository';
import { createDailySummaryJob, createWeeklySummaryJob } from '../../jobs/emailJobs';
import { ScheduledTask } from 'node-cron';

// Almacenamiento en memoria para las tareas dinámicas.
// La clave es el email del usuario, el valor es el objeto de la tarea.
export const activeDailyJobs = new Map<string, ScheduledTask>();
export const activeWeeklyJobs = new Map<string, ScheduledTask>();

class EmailController {
  private emailService: EmailService;

  constructor() {
    const climaRepository = new ClimaRepository();
    const accionRepository = new AccionRepository();
    const registroRepository = new RegistroRepository();

    const climaService = new ClimaService(climaRepository);
    const accionService = new AccionService(accionRepository, registroRepository);
    const registroService = new RegistroService(registroRepository);
    
    this.emailService = new EmailService(climaService, accionService, registroService);
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
        error
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
        error
      });
    }
  }

  async sendDailySummary(req: Request, res: Response): Promise<void> {
    try {
      const { email, ciudad } = req.body;

      if (!email || !ciudad) {
        res.status(400).json({
          success: false,
          message: 'Email y ciudad son requeridos'
        });
        return;
      }

      // Evita crear un job si ya existe uno para este email
      if (activeDailyJobs.has(email)) {
        res.status(200).json({
          success: true,
          message: 'Ya tienes una suscripción diaria activa.',
          data: { email, ciudad }
        });
        return;
      }

      // Crea y guarda el nuevo job
      const newJob = createDailySummaryJob(email, ciudad);
      activeDailyJobs.set(email, newJob);

      res.status(200).json({
        success: true,
        message: '¡Suscripción para resumen diario activada! Recibirás un correo cada 30 segundos.',
        data: { email, ciudad }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al activar el resumen diario',
        error
      });
    }
  }

  async sendWeeklySummary(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'El email es requerido'
        });
        return;
      }
      
      // Evita crear un job si ya existe uno para este email
      if (activeWeeklyJobs.has(email)) {
        res.status(200).json({
          success: true,
          message: 'Ya tienes una suscripción semanal activa.',
          data: { email }
        });
        return;
      }

      // Crea y guarda el nuevo job
      const newJob = createWeeklySummaryJob(email);
      activeWeeklyJobs.set(email, newJob);

      res.status(200).json({
        success: true,
        message: '¡Suscripción para resumen semanal activada! Recibirás un correo cada 30 segundos.',
        data: { email }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al activar el resumen semanal',
        error
      });
    }
  }
}

export default new EmailController();

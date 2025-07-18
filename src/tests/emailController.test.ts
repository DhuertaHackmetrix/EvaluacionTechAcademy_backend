import { Request, Response } from 'express';
import emailController, { activeDailyJobs, activeWeeklyJobs } from '../infrastructure/controllers/emailController';
import EmailService from '../application/services/emailService';
import * as emailJobs from '../jobs/emailJobs';
import { ScheduledTask } from 'node-cron';

// Mockear las dependencias
jest.mock('../application/services/emailService');
jest.mock('../jobs/emailJobs', () => ({
  createDailySummaryJob: jest.fn().mockReturnValue({ stop: jest.fn() }),
  createWeeklySummaryJob: jest.fn().mockReturnValue({ stop: jest.fn() }),
}));

describe('EmailController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };
  });

  afterEach(() => {
    // Limpiar los jobs activos para asegurar la independencia de los tests
    activeDailyJobs.forEach(job => job.stop());
    activeWeeklyJobs.forEach(job => job.stop());
    activeDailyJobs.clear();
    activeWeeklyJobs.clear();
  });

  describe('sendWelcomeEmail', () => {
    it('debería enviar un email de bienvenida con un email válido', async () => {
      mockRequest.body = { email: 'welcome@test.com' };
      (EmailService.prototype.sendWelcomeEmail as jest.Mock).mockResolvedValue(undefined);

      await emailController.sendWelcomeEmail(mockRequest as Request, mockResponse as Response);

      expect(EmailService.prototype.sendWelcomeEmail).toHaveBeenCalledWith('welcome@test.com');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Email de bienvenida enviado exitosamente',
        data: { email: 'welcome@test.com' },
      });
    });

    it('debería devolver error 400 si el email no se proporciona', async () => {
      mockRequest.body = {};
      await emailController.sendWelcomeEmail(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'El email es requerido' });
    });

    it('debería devolver error 400 si el email no es válido', async () => {
      mockRequest.body = { email: 'invalid-email' };
      await emailController.sendWelcomeEmail(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ success: false, message: 'El formato del email no es válido' });
    });
  });

  describe('sendDailySummary', () => {
    it('debería crear un job de resumen diario si no existe uno', async () => {
      mockRequest.body = { email: 'daily@test.com', ciudad: 'TestCity' };

      await emailController.sendDailySummary(mockRequest as Request, mockResponse as Response);

      expect(emailJobs.createDailySummaryJob).toHaveBeenCalledWith('daily@test.com', 'TestCity');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: '¡Suscripción para resumen diario activada! Recibirás un correo cada 30 segundos.',
        data: { email: 'daily@test.com', ciudad: 'TestCity' },
      });
    });

    it('debería devolver un mensaje si ya existe un job diario', async () => {
      mockRequest.body = { email: 'daily@test.com', ciudad: 'TestCity' };
      
      // Simular que el job ya existe la primera vez
      await emailController.sendDailySummary(mockRequest as Request, mockResponse as Response);
      
      // Llamar de nuevo
      await emailController.sendDailySummary(mockRequest as Request, mockResponse as Response);

      expect(emailJobs.createDailySummaryJob).toHaveBeenCalledTimes(1); // Solo se debe llamar una vez
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Ya tienes una suscripción diaria activa.',
        data: { email: 'daily@test.com', ciudad: 'TestCity' },
      });
    });
  });

  describe('sendWeeklySummary', () => {
    it('debería crear un job de resumen semanal si no existe uno', async () => {
      mockRequest.body = { email: 'weekly@test.com' };

      await emailController.sendWeeklySummary(mockRequest as Request, mockResponse as Response);

      expect(emailJobs.createWeeklySummaryJob).toHaveBeenCalledWith('weekly@test.com');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: '¡Suscripción para resumen semanal activada! Recibirás un correo cada 30 segundos.',
        data: { email: 'weekly@test.com' },
      });
    });
  });
});

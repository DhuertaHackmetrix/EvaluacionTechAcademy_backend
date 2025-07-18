import { Router } from 'express';
import emailController from '../infrastructure/controllers/emailController';

const router = Router();

/**
 * @route POST /api/email/welcome
 * @description Envía un email de bienvenida
 * @body { email: string }
 */
router.post('/welcome', (req, res) => emailController.sendWelcomeEmail(req, res));

/**
 * @route POST /api/email/test
 * @description Envía un email de prueba personalizado
 * @body { email: string, subject: string, message: string }
 */
router.post('/test', (req, res) => emailController.sendTestEmail(req, res));

/**
 * @route POST /api/email/daily-summary
 * @description Envía un resumen diario del clima y actividades
 * @body { email: string, ciudad: string }
 */
router.post('/daily-summary', (req, res) => emailController.sendDailySummary(req, res));

/**
 * @route POST /api/email/weekly-summary
 * @description Envía un resumen semanal de actividades
 * @body { email: string }
 */
router.post('/weekly-summary', (req, res) => emailController.sendWeeklySummary(req, res));

export default router;

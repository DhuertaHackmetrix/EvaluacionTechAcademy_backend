import { Router } from 'express';
import EmailController from '../infrastructure/controllers/emailController';

const router = Router();
const emailController = new EmailController();

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

export default router;

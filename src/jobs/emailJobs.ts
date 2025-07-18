import cron, { ScheduledTask } from 'node-cron';
import EmailService from '../application/services/emailService';
import ClimaService from '../application/services/climaService';
import AccionService from '../application/services/accionService';
import RegistroService from '../application/services/registroService';
import ClimaRepository from '../infrastructure/repositories/ClimaRepository';
import AccionRepository from '../infrastructure/repositories/AccionRepository';
import RegistroRepository from '../infrastructure/repositories/RegistroRepository';

// Instanciar todos los servicios necesarios
const climaRepository = new ClimaRepository();
const accionRepository = new AccionRepository();
const registroRepository = new RegistroRepository();

const climaService = new ClimaService(climaRepository);
const accionService = new AccionService(accionRepository, registroRepository);
const registroService = new RegistroService(registroRepository);
const emailService = new EmailService(climaService, accionService, registroService);

// --- Tareas Programadas Automáticas (al iniciar el servidor) ---

// Tarea automática para el resumen diario (todos los días a las 8:00 AM)
cron.schedule('0 8 * * *', async () => {
  const testEmail = 'diego.huertan@alumnos.uv.cl'; // Destinatario fijo para el job automático
  const testCity = 'concon';
  
  console.log(`🕒 [CRON-AUTO] Ejecutando tarea de resumen diario para ${testEmail}...`);
  try {
    await emailService.sendDailySummaryEmail(testEmail, testCity);
  } catch (error) {
    console.error('❌ [CRON-AUTO] Error en la tarea de resumen diario:', error);
  }
});

// Tarea automática para el resumen semanal (todos los lunes a las 8:00 AM)
cron.schedule('0 8 * * 1', async () => {
  const testEmail = 'diego.huertan@alumnos.uv.cl'; // Destinatario fijo para el job automático

  console.log(`🕒 [CRON-AUTO] Ejecutando tarea de resumen semanal para ${testEmail}...`);
  try {
    await emailService.sendWeeklySummaryEmail(testEmail);
  } catch (error) {
    console.error('❌ [CRON-AUTO] Error en la tarea de resumen semanal:', error);
  }
});

console.log('🕒 [CRON-AUTO] Tareas automáticas programadas.');


// --- Funciones para crear Tareas Programadas Dinámicas (desde los endpoints) ---

/**
 * Crea y empieza una tarea programada para el resumen diario.
 * @param email - El email del destinatario.
 * @param ciudad - La ciudad para el resumen del clima.
 * @returns La tarea de cron creada.
 */
export function createDailySummaryJob(email: string, ciudad: string): ScheduledTask {
  console.log(`🕒 Creando job dinámico de resumen diario para ${email} en ${ciudad}`);
  
  const job = cron.schedule('*/30 * * * * *', async () => {
    console.log(`🕒 [JOB-DINAMICO] Ejecutando resumen diario para ${email}...`);
    try {
      await emailService.sendDailySummaryEmail(email, ciudad);
    } catch (error) {
      console.error(`❌ [JOB-DINAMICO] Error en resumen diario para ${email}:`, error);
    }
  });

  return job;
}

/**
 * Crea y empieza una tarea programada para el resumen semanal.
 * @param email - El email del destinatario.
 * @returns La tarea de cron creada.
 */
export function createWeeklySummaryJob(email: string): ScheduledTask {
  console.log(`🕒 Creando job dinámico de resumen semanal para ${email}`);

  const job = cron.schedule('*/30 * * * * *', async () => {
    console.log(`🕒 [JOB-DINAMICO] Ejecutando resumen semanal para ${email}...`);
    try {
      await emailService.sendWeeklySummaryEmail(email);
    } catch (error) {
      console.error(`❌ [JOB-DINAMICO] Error en resumen semanal para ${email}:`, error);
    }
  });

  return job;
}

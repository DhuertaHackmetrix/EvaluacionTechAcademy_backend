import cron from 'node-cron';
import ClimaService from '../application/services/climaService';
import ClimaRepository from '../infrastructure/repositories/ClimaRepository';

const climaRepository = new ClimaRepository();
const climaService = new ClimaService(climaRepository);

cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea diaria de actualización del clima...');
  try {
    await climaService.obtenerClimaActual('santiago');
    console.log('Clima actualizado con éxito.');
  } catch (error) {
    console.error('Error al actualizar el clima:', error);
  }
});

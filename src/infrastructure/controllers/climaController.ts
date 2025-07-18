import { Request, Response } from 'express';
import ClimaService from '../../application/services/climaService';
import RegistroService from '../../application/services/registroService';
import ClimaRepository from '../repositories/ClimaRepository';
import RegistroRepository from '../repositories/RegistroRepository';
import dotenv from 'dotenv';
dotenv.config();
class ClimaController {
  private climaService: ClimaService;
  private registroService: RegistroService;

  constructor() {
    const climaRepository = new ClimaRepository();
    const registroRepository = new RegistroRepository();
    this.climaService = new ClimaService(climaRepository);
    this.registroService = new RegistroService(registroRepository);
  }

  async crearClima(req: Request, res: Response): Promise<void> {
    const { ciudad } = req.body;

    if (!ciudad) {
      res.status(400).json({ mensaje: 'Debes proporcionar una ciudad.' });
      return;
    }

    try {
      const clima = await this.climaService.obtenerClimaActual(ciudad);
      res.status(201).json(clima);
    } catch (error) {
      console.error('Error en crearClima:', error);
      res.status(500).json({ mensaje: 'Error al obtener el clima.', error });
    }
  }

  async elDiaEstaPara(req: Request, res: Response): Promise<void> {
    const { ciudad } = req.params;

    if (!ciudad) {
      res.status(400).json({ mensaje: 'Debes proporcionar una ciudad.' });
      return;
    }

    try {
      const [todasAcciones, accionElegida] = await this.climaService.elDiaEstaPara(ciudad);

      if (!accionElegida) {
        res.status(404).json({ mensaje: 'No se encontraron acciones para este clima.' });
        return;
      }

      const comentario = `Hoy es un buen día para ${accionElegida.nombre}`;
      const registroCreado = await this.registroService.registrarAccion(comentario, accionElegida.id);

      res.status(200).json({
        accionesDisponibles: todasAcciones,
        accionRecomendada: accionElegida,
        registro: registroCreado,
      });
    } catch (error) {
      console.error('Error completo:', error);
      res.status(500).json({
        mensaje: 'Error al obtener las acciones.',
      });
    }
  }

  async RegistrarAccion(req: Request, res: Response): Promise<void> {
    try {
      const comentario = `Hoy es un buen día para`;
      const registrarService = await this.registroService.registrarAccion(comentario, 1);
      res.status(200).json(registrarService);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las acciones.', error });
    }
  }
}

export default new ClimaController();

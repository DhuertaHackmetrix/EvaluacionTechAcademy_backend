import { Request, Response } from 'express';
import { climaService } from '../services/climaService';
import dotenv from 'dotenv';
dotenv.config();
class ClimaController {
  async crearClima(req: Request, res: Response): Promise<void> {
    const { ciudad } = req.body;

    if (!ciudad) {
      res.status(400).json({ mensaje: 'Debes proporcionar una ciudad.' });
      return;
    }

    try {
      const clima = await climaService.obtenerClimaActual(ciudad);
      res.status(201).json(clima);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el clima.', error });
      console.log(process.env.OPENWEATHERMAP_API_KEY);
    }
  }
  async elDiaEstaPara(req: Request, res: Response): Promise<void> {
    const { ciudad } = req.params;

    if (!ciudad) {
      res.status(400).json({ mensaje: 'Debes proporcionar una ciudad.' });
      return;
    }

    try {
      const acciones = await climaService.elDiaEstaPara(ciudad);
      res.status(200).json(acciones);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las acciones.', error });
    }
  }
}

export default new ClimaController();
import { Request, Response } from 'express';
import { climaService } from '../services/climaService';

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
    }
  }
}

export default new ClimaController();
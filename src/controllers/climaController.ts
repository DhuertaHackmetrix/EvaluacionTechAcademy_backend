import { Request, Response } from 'express';
import { climaService } from '../services/climaService';
import RegistroService from '../services/registroService';
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
    }
  }
async elDiaEstaPara(req: Request, res: Response): Promise<void> {
  const { ciudad } = req.params;

  if (!ciudad) {
    res.status(400).json({ mensaje: 'Debes proporcionar una ciudad.' });
    return;
  }

  try {
    const [todasAcciones, accionElegida] = await climaService.elDiaEstaPara(ciudad);
    
    if (!accionElegida) {
      res.status(404).json({ mensaje: 'No se encontraron acciones para este clima.' });
      return;
    }
    
    const comentario = `Hoy es un buen día para ${accionElegida.nombre}`;
    
    const registroService = new RegistroService();
    const registroCreado = await registroService.registrarAccion(comentario, accionElegida.id);
    
    res.status(200).json({
      accionesDisponibles: todasAcciones,
      accionRecomendada: accionElegida,
      registro: registroCreado
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
      const registroService = new RegistroService();
      const comentario = `Hoy es un buen día para`;
      const registrarService = await registroService.registrarAccion(comentario, 1);
      res.status(200).json(registrarService);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las acciones.', error });
    }
  }
}

export default new ClimaController();
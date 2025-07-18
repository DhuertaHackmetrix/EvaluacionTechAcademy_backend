import { Request, Response } from 'express';
import AccionService from '../../application/services/accionService';
import AccionRepository from '../repositories/AccionRepository';
import RegistroRepository from '../repositories/RegistroRepository';
import dotenv from 'dotenv';

dotenv.config();

class AccionController {
  public accionService: AccionService;

  constructor() {
    const accionRepository = new AccionRepository();
    const registroRepository = new RegistroRepository();
    this.accionService = new AccionService(accionRepository, registroRepository);
  }

  async crearAccion(req: Request, res: Response): Promise<void> {
    try {
      const { accion, nombreClima, descripcionAccion } = req.body;
      const nuevaAccion = await this.accionService.crearAccion(accion, nombreClima, descripcionAccion);
      res.status(201).json(nuevaAccion);
    } catch (error: any) {
      res.status(500).json({ mensaje: 'Error al crear la acción.', error: error.message });
    }
  }

  async leerAccion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const accion = await this.accionService.leerAccion(Number(id));
      if (accion) {
        res.status(200).json(accion);
      } else {
        res.status(404).json({ mensaje: 'Acción no encontrada.' });
      }
    } catch (error: any) {
      res.status(500).json({ mensaje: 'Error al leer la acción.', error: error.message });
    }
  }

  async deleteAccion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ mensaje: 'Debes proporcionar un ID.' });
      return;
    }

    try {
      await this.accionService.deleteAccion(Number(id));
      res.status(200).json({ mensaje: 'Acción eliminada con éxito.' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la acción.', error });
    }
  }

  async updateAccion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { accion } = req.body;

    if (!id || !accion) {
      res.status(400).json({ mensaje: 'Debes proporcionar un ID y una acción.' });
      return;
    }

    try {
      await this.accionService.updateAccion(Number(id), accion);
      res.status(200).json({ mensaje: 'Acción actualizada con éxito.' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la acción.', error });
    }
  }

  async getAllAcciones(req: Request, res: Response): Promise<void> {
    try {
      const acciones = await this.accionService.getAllAcciones();
      res.status(200).json(acciones);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las acciones.', error });
    }
  }
}

export default new AccionController();

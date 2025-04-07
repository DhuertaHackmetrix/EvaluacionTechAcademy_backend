import { Request, Response } from 'express';
import AccionService from '../services/accionService';
import dotenv from 'dotenv';

dotenv.config();

class AccionController {
  public accionService: AccionService;

  constructor() {
    this.accionService = new AccionService();
  }

  async crearAccion(req: Request, res: Response): Promise<void> {
    const { accion,nombreClima,descripcionAccion } = req.body;
    
    if (!accion) {
      res.status(400).json({ mensaje: 'Debes proporcionar una acción.' });
      return;
    }

    try {
      const nuevaAccion = await this.accionService.crearAccion(accion,nombreClima,descripcionAccion);
      res.status(201).json(nuevaAccion);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear la acción.', error });
    }
  }

  async leerAccion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ mensaje: 'Debes proporcionar un ID.' });
      return;
    }

    try {
      const accion = await this.accionService.leerAccion(Number(id));
      if (!accion) {
        res.status(404).json({ mensaje: 'Acción no encontrada.' });
        return;
      }
      res.status(200).json(accion);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al leer la acción.', error });
    }
  }

  async deleteAccion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ mensaje: 'Debes proporcionar un ID.' });
      return;
    }

    try {
      const resultado = await this.accionService.deleteAccion(Number(id));
      if (resultado === 0) {
        res.status(404).json({ mensaje: 'Acción no encontrada.' });
        return;
      }
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
      const resultado = await this.accionService.updateAccion(Number(id), accion);
      if (resultado[0] === 0) {
        res.status(404).json({ mensaje: 'Acción no encontrada.' });
        return;
      }
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
import { Request, Response } from 'express';
import RegistroService from '../../application/services/registroService';
import RegistroRepository from '../repositories/RegistroRepository';
import dotenv from 'dotenv';
dotenv.config();

class RegistroController {
  private registroService: RegistroService;

  constructor() {
    const registroRepository = new RegistroRepository();
    this.registroService = new RegistroService(registroRepository);
  }

  async registrarAccion(req: Request, res: Response): Promise<void> {
    try {
      const { comentario, accion_id } = req.body;
      const nuevoRegistro = await this.registroService.registrarAccion(comentario, accion_id);
      res.status(201).json(nuevoRegistro);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al registrar la acción.', error });
    }
  }

  async totalDeAcciones(req: Request, res: Response): Promise<void> {
    try {
      const total = await this.registroService.totalDeAcciones();
      res.status(200).json(total);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el total de acciones.', error });
    }
  }
}

export default new RegistroController();

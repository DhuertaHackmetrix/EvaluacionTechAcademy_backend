import { Request, Response } from 'express';
import RegistroService from '../../application/services/registroService';
import dotenv from 'dotenv';
dotenv.config();
class ClimaController {
    async totalAcciones(req: Request, res: Response): Promise<void> {
        try {
            const registroService = new RegistroService();

            const totalAcciones = await registroService.totalDeAcciones();
            res.status(200).json(totalAcciones);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las acciones.', error });
        }
    }
}

export default new ClimaController();
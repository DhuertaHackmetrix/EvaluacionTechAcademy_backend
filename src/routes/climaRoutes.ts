import { Router } from 'express';
import climaController from '../controllers/climaController';
const router = Router();

router.post('/obtenerClimas', climaController.crearClima);

export default router;

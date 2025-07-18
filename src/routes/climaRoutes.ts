import { Router } from 'express';
import climaController from '../infrastructure/controllers/climaController';
import accionController from '../infrastructure/controllers/accionController';
import registroController from '../infrastructure/controllers/registroController';

const router = Router();

// Ruta de clima
router.post('/obtenerClimas', (req, res) => climaController.crearClima(req, res));

// Rutas de acción con función flecha para preservar el contexto
router.post('/crearAccion', (req, res) => accionController.crearAccion(req, res));
router.get('/leerAccion/:id', (req, res) => accionController.leerAccion(req, res));
router.delete('/deleteAccion/:id', (req, res) => accionController.deleteAccion(req, res));
router.post('/updateAccion/:id', (req, res) => accionController.updateAccion(req, res));
router.get('/getAllAcciones', (req, res) => accionController.getAllAcciones(req, res));
router.post('/elDiaEstaPara/:ciudad', (req, res) => climaController.elDiaEstaPara(req, res));
router.post('/RegistrarAccion', (req, res) => climaController.RegistrarAccion(req, res));
router.get('/totalDeAcciones', (req, res) => registroController.totalDeAcciones(req, res));
export default router;

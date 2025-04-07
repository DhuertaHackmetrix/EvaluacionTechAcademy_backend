import { Router } from 'express';
import climaController from '../controllers/climaController';
import accionController from '../controllers/accionController';
const router = Router();

// Ruta de clima
router.post('/obtenerClimas', (req, res) => climaController.crearClima(req, res));

// Rutas de acción con función flecha para preservar el contexto
router.post('/crearAccion', (req, res) => accionController.crearAccion(req, res));
router.get('/leerAccion/:id', (req, res) => accionController.leerAccion(req, res));
router.delete('/deleteAccion/:id', (req, res) => accionController.deleteAccion(req, res));
router.post('/updateAccion/:id', (req, res) => accionController.updateAccion(req, res));
router.get('/getAllAcciones', (req, res) => accionController.getAllAcciones(req, res));
router.get('/elDiaEstaPara/:ciudad', (req, res) => climaController.elDiaEstaPara(req, res));

export default router;
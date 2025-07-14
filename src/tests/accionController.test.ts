import { Request, Response } from 'express';
import accionController from '../infrastructure/controllers/accionController';
import AccionService from '../application/services/accionService';

jest.mock('../services/accionService');

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('AccionController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };
  });

  describe('crearAccion', () => {
    it('debería crear una acción cuando se proporcionan datos válidos', async () => {
      const mockAccion = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 60,
        velocidad_viento: 5.2
      };
      
      mockRequest.body = { 
        accion: 'ir a la playa', 
        nombreClima: 'Sunny', 
        descripcionAccion: 'disfrutar del sol' 
      };
      
      (AccionService.prototype.crearAccion as jest.Mock).mockResolvedValue(mockAccion);
      
      await accionController.crearAccion(mockRequest as Request, mockResponse as Response);
      
      expect(AccionService.prototype.crearAccion).toHaveBeenCalledWith(
        'ir a la playa',
        'Sunny',
        'disfrutar del sol'
      );
      
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockAccion);
    });

    it('debería devolver error 400 cuando no se proporciona una acción', async () => {
      mockRequest.body = { nombreClima: 'Sunny', descripcionAccion: 'disfrutar del sol' };
      
      await accionController.crearAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Debes proporcionar una acción.' });
      
      expect(AccionService.prototype.crearAccion).not.toHaveBeenCalled();
    });

    it('debería manejar errores del servicio correctamente', async () => {
      mockRequest.body = { 
        accion: 'ir a la playa', 
        nombreClima: 'Sunny', 
        descripcionAccion: 'disfrutar del sol' 
      };
      
      const error = new Error('Error al crear acción');
      (AccionService.prototype.crearAccion as jest.Mock).mockRejectedValue(error);
      
      await accionController.crearAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al crear la acción.', 
        error 
      });
    });
  });

  describe('leerAccion', () => {
    it('debería leer una acción cuando se proporciona un ID válido', async () => {
      const mockAccion = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1
      };
      
      mockRequest.params = { id: '1' };
      
      (AccionService.prototype.leerAccion as jest.Mock).mockResolvedValue(mockAccion);
      
      await accionController.leerAccion(mockRequest as Request, mockResponse as Response);
      
      expect(AccionService.prototype.leerAccion).toHaveBeenCalledWith(1);
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockAccion);
    });

    it('debería devolver error 400 cuando no se proporciona un ID', async () => {
      mockRequest.params = {};
      
      await accionController.leerAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Debes proporcionar un ID.' });
      
      expect(AccionService.prototype.leerAccion).not.toHaveBeenCalled();
    });

    it('debería devolver error 404 cuando no se encuentra la acción', async () => {
      mockRequest.params = { id: '999' };
      
      (AccionService.prototype.leerAccion as jest.Mock).mockResolvedValue(null);
      
      await accionController.leerAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Acción no encontrada.' });
    });

    it('debería manejar errores del servicio correctamente', async () => {
      mockRequest.params = { id: '1' };
      
      const error = new Error('Error al leer acción');
      (AccionService.prototype.leerAccion as jest.Mock).mockRejectedValue(error);
      
      await accionController.leerAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al leer la acción.', 
        error 
      });
    });
  });

  describe('deleteAccion', () => {
    it('debería eliminar una acción cuando se proporciona un ID válido', async () => {
      mockRequest.params = { id: '1' };
      
      (AccionService.prototype.deleteAccion as jest.Mock).mockResolvedValue(1);
      
      await accionController.deleteAccion(mockRequest as Request, mockResponse as Response);
      
      expect(AccionService.prototype.deleteAccion).toHaveBeenCalledWith(1);
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Acción eliminada con éxito.' });
    });

    it('debería devolver error 400 cuando no se proporciona un ID', async () => {
      mockRequest.params = {};
      
      await accionController.deleteAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Debes proporcionar un ID.' });
      
      expect(AccionService.prototype.deleteAccion).not.toHaveBeenCalled();
    });

    it('debería devolver error 404 cuando no se encuentra la acción', async () => {
      mockRequest.params = { id: '999' };
      
      (AccionService.prototype.deleteAccion as jest.Mock).mockResolvedValue(0);
      
      await accionController.deleteAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Acción no encontrada.' });
    });

    it('debería manejar errores del servicio correctamente', async () => {
      mockRequest.params = { id: '1' };
      
      const error = new Error('Error al eliminar acción');
      (AccionService.prototype.deleteAccion as jest.Mock).mockRejectedValue(error);
      
      await accionController.deleteAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al eliminar la acción.', 
        error 
      });
    });
  });

  describe('updateAccion', () => {
    it('debería actualizar una acción cuando se proporcionan datos válidos', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { accion: 'ir al cine' };
      
      (AccionService.prototype.updateAccion as jest.Mock).mockResolvedValue([1]);
      
      await accionController.updateAccion(mockRequest as Request, mockResponse as Response);
      
      expect(AccionService.prototype.updateAccion).toHaveBeenCalledWith(1, 'ir al cine');
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Acción actualizada con éxito.' });
    });

    it('debería devolver error 400 cuando no se proporciona un ID o una acción', async () => {
      mockRequest.params = {};
      mockRequest.body = { accion: 'ir al cine' };
      
      await accionController.updateAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Debes proporcionar un ID y una acción.' 
      });
      
      mockRequest.params = { id: '1' };
      mockRequest.body = {};
      
      await accionController.updateAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Debes proporcionar un ID y una acción.' 
      });
      
      expect(AccionService.prototype.updateAccion).not.toHaveBeenCalled();
    });

    it('debería devolver error 404 cuando no se encuentra la acción', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { accion: 'ir al cine' };
      
      (AccionService.prototype.updateAccion as jest.Mock).mockResolvedValue([0]);
      
      await accionController.updateAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Acción no encontrada.' });
    });

    it('debería manejar errores del servicio correctamente', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { accion: 'ir al cine' };
      
      const error = new Error('Error al actualizar acción');
      (AccionService.prototype.updateAccion as jest.Mock).mockRejectedValue(error);
      
      await accionController.updateAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al actualizar la acción.', 
        error 
      });
    });
  });

  describe('getAllAcciones', () => {
    it('debería obtener todas las acciones', async () => {
      const mockAcciones = [
        { id: 1, nombre: 'ir a la playa', clima_id: 1 },
        { id: 2, nombre: 'quedarse en casa', clima_id: 2 },
        { id: 3, nombre: 'ir al cine', clima_id: 2 }
      ];
      
      (AccionService.prototype.getAllAcciones as jest.Mock).mockResolvedValue(mockAcciones);
      
      await accionController.getAllAcciones(mockRequest as Request, mockResponse as Response);
      
      expect(AccionService.prototype.getAllAcciones).toHaveBeenCalled();
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockAcciones);
    });

    it('debería manejar errores del servicio correctamente', async () => {
      const error = new Error('Error al obtener acciones');
      (AccionService.prototype.getAllAcciones as jest.Mock).mockRejectedValue(error);
      
      await accionController.getAllAcciones(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al obtener las acciones.', 
        error 
      });
    });
  });
});

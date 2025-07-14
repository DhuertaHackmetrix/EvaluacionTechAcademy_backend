import { Request, Response } from 'express';
import climaController from '../infrastructure/controllers/climaController';
import { climaService } from '../application/services/climaService';
import RegistroService from '../application/services/registroService';

jest.mock('../services/climaService');
jest.mock('../services/registroService');

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ClimaController', () => {
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

  describe('crearClima', () => {
    it('debería devolver un clima cuando se proporciona una ciudad válida', async () => {
      const mockClima = {
        id: 1,
        nombre: 'Clear',
        descripcion: 'cielo despejado',
        temperatura: 25.5,
        humedad: 60,
        velocidad_viento: 5.2
      };
      
      mockRequest.body = { ciudad: 'Madrid' };
      
      (climaService.obtenerClimaActual as jest.Mock).mockResolvedValue(mockClima);
      
      await climaController.crearClima(mockRequest as Request, mockResponse as Response);
      
      expect(climaService.obtenerClimaActual).toHaveBeenCalledWith('Madrid');
      
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockClima);
    });

    it('debería devolver error 400 cuando no se proporciona una ciudad', async () => {
      mockRequest.body = {};
      
      await climaController.crearClima(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Debes proporcionar una ciudad.' });
      
      expect(climaService.obtenerClimaActual).not.toHaveBeenCalled();
    });

    it('debería manejar errores del servicio correctamente', async () => {
      mockRequest.body = { ciudad: 'Madrid' };
      
      const error = new Error('Error al obtener clima');
      (climaService.obtenerClimaActual as jest.Mock).mockRejectedValue(error);
      
      await climaController.crearClima(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al obtener el clima.', 
        error 
      });
      
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('elDiaEstaPara', () => {
    it('debería devolver acciones recomendadas cuando se proporciona una ciudad válida', async () => {
      const mockAcciones = [
        { id: 1, nombre: 'ir a la playa', clima_id: 1 },
        { id: 2, nombre: 'pasear por el parque', clima_id: 1 }
      ];
      
      const mockAccionElegida = { id: 1, nombre: 'ir a la playa', clima_id: 1 };
      
      const mockRegistro = {
        id: 1,
        comentario: 'Hoy es un buen día para ir a la playa',
        accion_id: 1,
        fecha: new Date()
      };
      
      mockRequest.params = { ciudad: 'Madrid' };
      
      (climaService.elDiaEstaPara as jest.Mock).mockResolvedValue([mockAcciones, mockAccionElegida]);
      (RegistroService.prototype.registrarAccion as jest.Mock).mockResolvedValue(mockRegistro);
      
      await climaController.elDiaEstaPara(mockRequest as Request, mockResponse as Response);
      
      expect(climaService.elDiaEstaPara).toHaveBeenCalledWith('Madrid');
      
      expect(RegistroService.prototype.registrarAccion).toHaveBeenCalledWith(
        'Hoy es un buen día para ir a la playa',
        1
      );
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        accionesDisponibles: mockAcciones,
        accionRecomendada: mockAccionElegida,
        registro: mockRegistro
      });
    });

    it('debería devolver error 400 cuando no se proporciona una ciudad', async () => {
      mockRequest.params = {};
      
      await climaController.elDiaEstaPara(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'Debes proporcionar una ciudad.' });
      
      expect(climaService.elDiaEstaPara).not.toHaveBeenCalled();
    });

    it('debería devolver error 404 cuando no hay acciones para el clima', async () => {
      mockRequest.params = { ciudad: 'Madrid' };
      
      (climaService.elDiaEstaPara as jest.Mock).mockResolvedValue([[], undefined]);
      
      await climaController.elDiaEstaPara(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ mensaje: 'No se encontraron acciones para este clima.' });
      
      expect(RegistroService.prototype.registrarAccion).not.toHaveBeenCalled();
    });

    it('debería manejar errores del servicio correctamente', async () => {
      mockRequest.params = { ciudad: 'Madrid' };
      
      const error = new Error('Error al obtener acciones');
      (climaService.elDiaEstaPara as jest.Mock).mockRejectedValue(error);
      
      await climaController.elDiaEstaPara(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al obtener las acciones.'
      });
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('RegistrarAccion', () => {
    it('debería registrar una acción correctamente', async () => {
      const mockRegistro = {
        id: 1,
        comentario: 'Hoy es un buen día para',
        accion_id: 1,
        fecha: new Date()
      };
      
      (RegistroService.prototype.registrarAccion as jest.Mock).mockResolvedValue(mockRegistro);
      
      await climaController.RegistrarAccion(mockRequest as Request, mockResponse as Response);
      
      expect(RegistroService.prototype.registrarAccion).toHaveBeenCalledWith(
        'Hoy es un buen día para',
        1
      );
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockRegistro);
    });

    it('debería manejar errores del servicio correctamente', async () => {
      const error = new Error('Error al registrar acción');
      (RegistroService.prototype.registrarAccion as jest.Mock).mockRejectedValue(error);
      
      await climaController.RegistrarAccion(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al obtener las acciones.', 
        error 
      });
    });
  });
});
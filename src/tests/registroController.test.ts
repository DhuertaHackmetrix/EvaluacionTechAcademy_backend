import { Request, Response } from 'express';
import registroController from '../infrastructure/controllers/registroController';
import RegistroService from '../application/services/registroService';

jest.mock('../services/registroService');

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('RegistroController', () => {
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

  describe('totalAcciones', () => {
    it('debería devolver el total de acciones agrupadas por clima', async () => {
      const mockTotalAcciones = {
        'Clear': {
          count: 2,
          acciones: [
            { id: 1, nombre: 'ir a la playa', fecha: new Date() },
            { id: 3, nombre: 'pasear por el parque', fecha: new Date() }
          ]
        },
        'Rain': {
          count: 1,
          acciones: [
            { id: 2, nombre: 'quedarse en casa', fecha: new Date() }
          ]
        }
      };
      
      (RegistroService.prototype.totalDeAcciones as jest.Mock).mockResolvedValue(mockTotalAcciones);
      
      await registroController.totalAcciones(mockRequest as Request, mockResponse as Response);
      
      expect(RegistroService.prototype.totalDeAcciones).toHaveBeenCalled();
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockTotalAcciones);
    });

    it('debería manejar el caso donde no hay registros', async () => {
      const mockSinRegistros = { mensaje: 'No hay registros de acciones.' };
      
      (RegistroService.prototype.totalDeAcciones as jest.Mock).mockResolvedValue(mockSinRegistros);
      
      await registroController.totalAcciones(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockSinRegistros);
    });

    it('debería manejar errores del servicio correctamente', async () => {
      const error = new Error('Error en la base de datos');
      (RegistroService.prototype.totalDeAcciones as jest.Mock).mockRejectedValue(error);
      
      await registroController.totalAcciones(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ 
        mensaje: 'Error al obtener las acciones.', 
        error 
      });
    });
  });
});
import { Request, Response } from 'express';
import accionController from '../infrastructure/controllers/accionController';
import AccionService from '../application/services/accionService';
import AccionEntity from '../domain/entities/accionEntity';

jest.mock('../application/services/accionService');

const AccionServiceMock = AccionService as jest.MockedClass<typeof AccionService>;

describe('AccionController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let accionServiceInstance: jest.Mocked<AccionService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    accionServiceInstance = {
      crearAccion: jest.fn(),
      leerAccion: jest.fn(),
      deleteAccion: jest.fn(),
      updateAccion: jest.fn(),
      getAllAcciones: jest.fn(),
      obtenerTopAccionesPorClima: jest.fn(),
    } as any;

    AccionServiceMock.mockImplementation(() => accionServiceInstance);
  });

  describe('crearAccion', () => {
    it('debería crear una acción', async () => {
      mockRequest.body = { accion: 'test', nombreClima: 'test', descripcionAccion: 'test' };
      const nuevaAccion = new AccionEntity(1, 'test', 'test', 1, 1, 1);
      accionController.accionService.crearAccion = jest.fn().mockResolvedValue(nuevaAccion);
      await accionController.crearAccion(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(nuevaAccion);
    });
  });

  describe('leerAccion', () => {
    it('debería leer una acción', async () => {
        mockRequest.params = { id: '1' };
        const accion = new AccionEntity(1, 'test', 'test', 1, 1, 1);
        accionController.accionService.leerAccion = jest.fn().mockResolvedValue(accion);
        await accionController.leerAccion(mockRequest as Request, mockResponse as Response);
        expect(responseStatus).toHaveBeenCalledWith(200);
        expect(responseJson).toHaveBeenCalledWith(accion);
    });
  });

  describe('getAllAcciones', () => {
    it('debería obtener todas las acciones', async () => {
        const mockAcciones = [new AccionEntity(1, 'test', 'd', 1, 1, 1)];
        accionController.accionService.getAllAcciones = jest.fn().mockResolvedValue(mockAcciones);
        await accionController.getAllAcciones(mockRequest as Request, mockResponse as Response);
        expect(responseStatus).toHaveBeenCalledWith(200);
        expect(responseJson).toHaveBeenCalledWith(mockAcciones);
    });
  });
});

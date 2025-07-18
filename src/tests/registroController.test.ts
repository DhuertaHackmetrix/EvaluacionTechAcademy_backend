import { Request, Response } from 'express';
import registroController from '../infrastructure/controllers/registroController';
import RegistroService from '../application/services/registroService';
import RegistroEntity from '../domain/entities/registroEntity';

jest.mock('../application/services/registroService');

const RegistroServiceMock = RegistroService as jest.MockedClass<typeof RegistroService>;

describe('RegistroController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let registroServiceInstance: jest.Mocked<RegistroService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    registroServiceInstance = new (RegistroService as any)();
    (registroController as any).registroService = registroServiceInstance;
  });

  describe('registrarAccion', () => {
    it('debería registrar una acción', async () => {
      mockRequest.body = { accionId: 1, comentario: 'test' };
      const nuevoRegistro = new RegistroEntity(1, 'test',1, new Date());
      (registroServiceInstance.registrarAccion as jest.Mock).mockResolvedValue(nuevoRegistro);
      await registroController.registrarAccion(mockRequest as Request, mockResponse as Response);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(nuevoRegistro);
    });
  });

  describe('totalDeAcciones', () => {
    it('debería devolver el total de acciones', async () => {
        const total = { 'Soleado': 1 };
        (registroServiceInstance.totalDeAcciones as jest.Mock).mockResolvedValue(total);
        await registroController.totalDeAcciones(mockRequest as Request, mockResponse as Response);
        expect(responseStatus).toHaveBeenCalledWith(200);
        expect(responseJson).toHaveBeenCalledWith(total);
    });
  });
});

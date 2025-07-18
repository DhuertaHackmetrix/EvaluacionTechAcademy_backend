import RegistroService from '../application/services/registroService';
import { IRegistroRepository } from '../domain/repositories/registroRepository';
import RegistroEntity from '../domain/entities/registroEntity';
import { RegistroSemanalDTO } from '../domain/DTO/RegistroSemanalDTO';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('RegistroService', () => {
  let registroService: RegistroService;
  let mockRegistroRepository: jest.Mocked<IRegistroRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegistroRepository = {
      registrarAccion: jest.fn(),
      findWeeklyRegistrosWithAccion: jest.fn(),
      findAllWithRelations: jest.fn(),
      countByAccionId: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    registroService = new RegistroService(mockRegistroRepository);
  });

  describe('registrarAccion', () => {
    it('debería registrar una acción y devolver una RegistroEntity', async () => {
      const mockRegistroData = {
        id: 1,
        comentario: 'Test',
        accion_id: 1,
        fecha: new Date(),
      };
      mockRegistroRepository.registrarAccion.mockResolvedValue(mockRegistroData);

      const result = await registroService.registrarAccion('Test', 1);

      expect(mockRegistroRepository.registrarAccion).toHaveBeenCalledWith('Test', 1);
      expect(result).toBeInstanceOf(RegistroEntity);
      expect(result.id).toBe(1);
    });
  });

  describe('getWeeklyRegistrosGroupedByAccion', () => {
    it('debería devolver los registros semanales agrupados', async () => {
      const mockData: RegistroSemanalDTO[] = [
        { accionNombre: 'Correr', totalVeces: 5 },
        { accionNombre: 'Nadar', totalVeces: 2 },
      ];
      mockRegistroRepository.findWeeklyRegistrosWithAccion.mockResolvedValue(mockData);

      const result = await registroService.getWeeklyRegistrosGroupedByAccion();

      expect(mockRegistroRepository.findWeeklyRegistrosWithAccion).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('totalDeAcciones', () => {
    it('debería devolver el total de acciones agrupadas por clima', async () => {
      const mockRegistros = [
        {
          toJSON: () => ({
            id: 1,
            comentario: 'test',
            accion_id: 1,
            fecha: new Date(),
            accion: { id: 1, nombre: 'Accion 1', clima: { id: 1, nombre: 'Soleado' } },
          }),
        },
        {
          toJSON: () => ({
            id: 2,
            comentario: 'test 2',
            accion_id: 2,
            fecha: new Date(),
            accion: { id: 2, nombre: 'Accion 2', clima: { id: 1, nombre: 'Soleado' } },
          }),
        },
      ];
      mockRegistroRepository.findAllWithRelations.mockResolvedValue(mockRegistros as any);

      const result = await registroService.totalDeAcciones();

      expect(result['Soleado'].veces_realizada).toBe(2);
    });

    it('debería devolver un mensaje si no hay registros', async () => {
        mockRegistroRepository.findAllWithRelations.mockResolvedValue([]);
        const result = await registroService.totalDeAcciones();
        expect(result).toEqual({ mensaje: 'No hay registros de acciones.' });
    });
  });
});

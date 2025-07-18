import AccionService from '../application/services/accionService';
import { IAccionRepository } from '../domain/repositories/accionRepository';
import { IRegistroRepository } from '../domain/repositories/registroRepository';
import AccionEntity from '../domain/entities/accionEntity';
import ClimaEntity from '../domain/entities/climaEntity';
import { AccionTopDTO } from '../domain/DTO/AccionTopDTO';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('AccionService', () => {
  let accionService: AccionService;
  let mockAccionRepository: jest.Mocked<IAccionRepository>;
  let mockRegistroRepository: jest.Mocked<IRegistroRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAccionRepository = {
      crearAccion: jest.fn(),
      leerAccion: jest.fn(),
      deleteAccion: jest.fn(),
      updateAccion: jest.fn(),
      getAllAcciones: jest.fn(),
    };
    mockRegistroRepository = {
      registrarAccion: jest.fn(),
      findWeeklyRegistrosWithAccion: jest.fn(),
      findAllWithRelations: jest.fn(),
      countByAccionId: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    accionService = new AccionService(mockAccionRepository, mockRegistroRepository);
  });

  describe('crearAccion', () => {
    it('debería crear una acción y devolver una AccionEntity', async () => {
      const mockAccionData = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 60,
        velocidad_viento: 5.2,
      };
      mockAccionRepository.crearAccion.mockResolvedValue(mockAccionData);

      const result = await accionService.crearAccion('ir a la playa', 'Sunny', 'disfrutar del sol');

      expect(mockAccionRepository.crearAccion).toHaveBeenCalledWith('ir a la playa', 'Sunny', 'disfrutar del sol');
      expect(result).toBeInstanceOf(AccionEntity);
      expect(result.id).toBe(1);
    });

    it('debería lanzar un error si el repositorio falla', async () => {
      mockAccionRepository.crearAccion.mockRejectedValue(new Error('Error de base de datos'));

      await expect(accionService.crearAccion('test', 'test', 'test')).rejects.toThrow('Error de base de datos');
    });
  });

  describe('leerAccion', () => {
    it('debería leer una acción y devolver una AccionEntity', async () => {
      const mockAccionData = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 60,
        velocidad_viento: 5.2,
      };
      mockAccionRepository.leerAccion.mockResolvedValue(mockAccionData);

      const result = await accionService.leerAccion(1);

      expect(mockAccionRepository.leerAccion).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(AccionEntity);
      expect(result?.id).toBe(1);
    });

    it('debería devolver null si la acción no se encuentra', async () => {
      mockAccionRepository.leerAccion.mockResolvedValue(null);

      const result = await accionService.leerAccion(999);

      expect(result).toBeNull();
    });
  });

  describe('deleteAccion', () => {
    it('debería llamar al método delete del repositorio', async () => {
      mockAccionRepository.deleteAccion.mockResolvedValue();
      await accionService.deleteAccion(1);
      expect(mockAccionRepository.deleteAccion).toHaveBeenCalledWith(1);
    });
  });

  describe('updateAccion', () => {
    it('debería llamar al método update del repositorio', async () => {
      mockAccionRepository.updateAccion.mockResolvedValue();
      await accionService.updateAccion(1, 'nuevo nombre');
      expect(mockAccionRepository.updateAccion).toHaveBeenCalledWith(1, 'nuevo nombre');
    });
  });

  describe('getAllAcciones', () => {
    it('debería devolver un array de AccionEntity', async () => {
      const mockAccionesData = [
        { id: 1, nombre: 'a1', descripcion: 'd1', clima_id: 1, humedad: 1, velocidad_viento: 1 },
        { id: 2, nombre: 'a2', descripcion: 'd2', clima_id: 2, humedad: 2, velocidad_viento: 2 },
      ];
      mockAccionRepository.getAllAcciones.mockResolvedValue(mockAccionesData);

      const result = await accionService.getAllAcciones();

      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(AccionEntity);
    });
  });

  describe('obtenerTopAccionesPorClima', () => {
    it('debería calcular y devolver las mejores y peores acciones', async () => {
        const clima = new ClimaEntity(1, 'Soleado', 'Despejado', 25, 50, 10);
        const acciones = [
            new AccionEntity(1, 'Playa', 'd1', 1, 50, 10), // puntaje 100
            new AccionEntity(2, 'Piscina', 'd2', 1, 60, 15), // puntaje 80
            new AccionEntity(3, 'Cine', 'd3', 1, 80, 20), // puntaje 40
            new AccionEntity(4, 'Esquiar', 'd4', 1, 10, 30), // puntaje 20
        ];
        mockAccionRepository.getAllAcciones.mockResolvedValue(acciones);

        const result = await accionService.obtenerTopAccionesPorClima(clima, 2);

        expect(result.mejores.length).toBe(2);
        expect(result.peores.length).toBe(2);
        expect(result.mejores[0].nombre).toBe('Playa');
        expect(result.peores[0].nombre).toBe('Cine');
    });
  });
});

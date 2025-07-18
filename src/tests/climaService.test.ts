import ClimaService from '../application/services/climaService';
import { IClimaRepository } from '../domain/repositories/climaRepository';
import ClimaEntity from '../domain/entities/climaEntity';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ClimaService', () => {
  let climaService: ClimaService;
  let mockClimaRepository: jest.Mocked<IClimaRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClimaRepository = {
      obtenerClimaActual: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAccionesByClimaId: jest.fn(),
    };
    climaService = new ClimaService(mockClimaRepository);
  });

  describe('obtenerClimaActual', () => {
    it('debería obtener el clima y devolver una ClimaEntity', async () => {
      const mockClimaData = {
        id: 1,
        nombre: 'Soleado',
        descripcion: 'Despejado',
        temperatura: 25,
        humedad: 50,
        velocidad_viento: 10,
      };
      mockClimaRepository.obtenerClimaActual.mockResolvedValue(mockClimaData);

      const result = await climaService.obtenerClimaActual('santiago');

      expect(mockClimaRepository.obtenerClimaActual).toHaveBeenCalledWith('santiago');
      expect(result).toBeInstanceOf(ClimaEntity);
      expect(result.id).toBe(1);
    });
  });

  describe('elDiaEstaPara', () => {
    it('debería devolver acciones y una acción elegida', async () => {
      const mockClimaData = { id: 1 };
      const mockAccionesData = [
        { id: 1, nombre: 'Playa', descripcion: 'd1', clima_id: 1, humedad: 50, velocidad_viento: 10 },
        { id: 2, nombre: 'Piscina', descripcion: 'd2', clima_id: 1, humedad: 60, velocidad_viento: 15 },
      ];
      mockClimaRepository.obtenerClimaActual.mockResolvedValue(mockClimaData);
      mockClimaRepository.findAccionesByClimaId.mockResolvedValue(mockAccionesData);

      const [acciones, accionElegida] = await climaService.elDiaEstaPara('santiago');

      expect(acciones.length).toBe(2);
      expect(accionElegida).toBeDefined();
    });
  });
});

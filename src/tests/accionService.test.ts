import AccionService from '../services/accionService';
import Accion from '../models/accion';
import Clima from '../models/clima';

jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('../models/accion');
jest.mock('../models/clima');

describe('AccionService', () => {
  let accionService: AccionService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    accionService = new AccionService();
  });
  
  describe('crearAccion', () => {
    it('debería crear una acción con los datos correctos', async () => {
      const mockClima = {
        id: 1,
        nombre: 'Sunny',
        humedad: 60,
        velocidad_viento: 5.2
      };
      
      const mockAccionCreada = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 60,
        velocidad_viento: 5.2
      };
      
      (Clima.findOne as jest.Mock).mockResolvedValue(mockClima);
      (Accion.create as jest.Mock).mockResolvedValue(mockAccionCreada);
      
      const resultado = await accionService.crearAccion(
        'ir a la playa', 
        'Sunny', 
        'disfrutar del sol'
      );
      
      expect(Clima.findOne).toHaveBeenCalledWith({ where: { nombre: 'Sunny' } });
      
      expect(Accion.create).toHaveBeenCalledWith({
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 60,
        velocidad_viento: 5.2
      });
      
      expect(resultado).toEqual(mockAccionCreada);
    });
    
    it('debería manejar valores nulos en humedad y velocidad_viento', async () => {
      const mockClimaSinDatos = {
        id: 1,
        nombre: 'Sunny',
      };
      
      const mockAccionCreada = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 0,
        velocidad_viento: 0
      };
      
      (Clima.findOne as jest.Mock).mockResolvedValue(mockClimaSinDatos);
      (Accion.create as jest.Mock).mockResolvedValue(mockAccionCreada);
      
      const resultado = await accionService.crearAccion(
        'ir a la playa', 
        'Sunny', 
        'disfrutar del sol'
      );
      
      expect(Accion.create).toHaveBeenCalledWith({
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol',
        clima_id: 1,
        humedad: 0,
        velocidad_viento: 0
      });
      
      expect(resultado).toEqual(mockAccionCreada);
    });
    
    it('debería lanzar error si la acción está vacía', async () => {
      await expect(accionService.crearAccion('', 'Sunny', 'descripción'))
        .rejects
        .toThrow('Accion no puede ser vacio');
      
      expect(Clima.findOne).not.toHaveBeenCalled();
    });
    
    it('debería lanzar error si no se encuentra el clima', async () => {
      (Clima.findOne as jest.Mock).mockResolvedValue(null);
      
      await expect(accionService.crearAccion('ir a la playa', 'ClimaInexistente', 'descripción'))
        .rejects
        .toThrow('No se encontró un clima con el nombre: ClimaInexistente');
      
      expect(Accion.create).not.toHaveBeenCalled();
    });
    
    it('debería manejar errores en la creación', async () => {
      const mockClima = {
        id: 1,
        nombre: 'Sunny',
        humedad: 60,
        velocidad_viento: 5.2
      };
      
      (Clima.findOne as jest.Mock).mockResolvedValue(mockClima);
      (Accion.create as jest.Mock).mockRejectedValue(new Error('Error en la base de datos'));
      
      await expect(accionService.crearAccion('ir a la playa', 'Sunny', 'descripción'))
        .rejects
        .toThrow('Error en la base de datos');
      
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('leerAccion', () => {
    it('debería leer una acción por su id', async () => {
      const mockAccion = {
        id: 1,
        nombre: 'ir a la playa',
        descripcion: 'disfrutar del sol'
      };
      
      (Accion.findOne as jest.Mock).mockResolvedValue(mockAccion);
      
      const resultado = await accionService.leerAccion(1);
      
      expect(Accion.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      
      expect(resultado).toEqual(mockAccion);
    });
    
    it('debería lanzar error si el id está vacío', async () => {
      expect(() => accionService.leerAccion(0))
        .toThrow('Id no puede ser vacio');
      
      expect(Accion.findOne).not.toHaveBeenCalled();
    });
  });
  
  describe('deleteAccion', () => {
    it('debería eliminar una acción por su id', async () => {
      (Accion.destroy as jest.Mock).mockResolvedValue(1);
      
      const resultado = await accionService.deleteAccion(1);
      
      expect(Accion.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      
      expect(resultado).toBe(1);
    });
    
    it('debería lanzar error si el id está vacío', async () => {
      expect(() => accionService.deleteAccion(0))
        .toThrow('Id no puede ser vacio');
      
      expect(Accion.destroy).not.toHaveBeenCalled();
    });
  });
  
  describe('updateAccion', () => {
    it('debería actualizar el nombre de una acción', async () => {
      (Accion.update as jest.Mock).mockResolvedValue([1]);
      
      const resultado = await accionService.updateAccion(1, 'ir al cine');
      
      expect(Accion.update).toHaveBeenCalledWith(
        { nombre: 'ir al cine' },
        { where: { id: 1 } }
      );
      
      expect(resultado).toEqual([1]);
    });
    
    it('debería lanzar error si el id está vacío', async () => {
      await expect(accionService.updateAccion(0, 'ir al cine'))
        .rejects
        .toThrow('Id no puede ser vacio');
      
      expect(Accion.update).not.toHaveBeenCalled();
    });
    
    it('debería lanzar error si la acción está vacía', async () => {
      await expect(accionService.updateAccion(1, ''))
        .rejects
        .toThrow('Accion no puede ser vacio');
      
      expect(Accion.update).not.toHaveBeenCalled();
    });
  });
  
  describe('getAllAcciones', () => {
    it('debería obtener todas las acciones', async () => {
      const mockAcciones = [
        { id: 1, nombre: 'ir a la playa' },
        { id: 2, nombre: 'quedarse en casa' },
        { id: 3, nombre: 'ir al cine' }
      ];
      
      (Accion.findAll as jest.Mock).mockResolvedValue(mockAcciones);
      
      const resultado = await accionService.getAllAcciones();
      
      expect(Accion.findAll).toHaveBeenCalled();
      
      expect(resultado).toEqual(mockAcciones);
      expect(resultado.length).toBe(3);
    });
    
    it('debería devolver un array vacío cuando no hay acciones', async () => {
      (Accion.findAll as jest.Mock).mockResolvedValue([]);
      
      const resultado = await accionService.getAllAcciones();
      
      expect(resultado).toEqual([]);
      expect(resultado.length).toBe(0);
    });
  });
});
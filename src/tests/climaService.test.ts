import { climaService } from '../services/climaService';
import Clima from '../models/clima';
import Accion from '../models/accion';
import axios from 'axios';

jest.mock('axios');
jest.mock('../models/clima');
jest.mock('../models/accion');
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ClimaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('obtenerClimaActual', () => {
    it('debería obtener clima de la API y devolverlo si ya existe en la BD', async () => {
      const mockApiResponse = {
        data: {
          weather: [{ main: 'Clear', description: 'cielo despejado' }],
          main: { temp: 25.5, humidity: 60 },
          wind: { speed: 5.2 }
        }
      };
      
      const mockClimaExistente = {
        id: 1,
        nombre: 'Clear',
        descripcion: 'cielo despejado',
        temperatura: 25.5,
        humedad: 60,
        velocidad_viento: 5.2
      };
      
      (axios.get as jest.Mock).mockResolvedValue(mockApiResponse);
      (Clima.findOne as jest.Mock).mockResolvedValue(mockClimaExistente);
      
      const resultado = await climaService.obtenerClimaActual('Madrid');
      
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('q=Madrid')
      );
      
      expect(Clima.findOne).toHaveBeenCalledWith({ 
        where: { nombre: 'Clear' } 
      });
      
      expect(Clima.create).not.toHaveBeenCalled();
      
      expect(resultado).toEqual(mockClimaExistente);
    });
    
    it('debería crear un nuevo clima si no existe en la BD', async () => {
      const mockApiResponse = {
        data: {
          weather: [{ main: 'Clouds', description: 'nublado' }],
          main: { temp: 18.0, humidity: 75 },
          wind: { speed: 3.5 }
        }
      };
      
      const mockClimaCreado = {
        id: 2,
        nombre: 'Clouds',
        descripcion: 'nublado',
        temperatura: 18.0,
        humedad: 75,
        velocidad_viento: 3.5
      };
      
      (axios.get as jest.Mock).mockResolvedValue(mockApiResponse);
      (Clima.findOne as jest.Mock).mockResolvedValue(null);
      (Clima.create as jest.Mock).mockResolvedValue(mockClimaCreado);
      
      const resultado = await climaService.obtenerClimaActual('Barcelona');
      
      expect(axios.get).toHaveBeenCalled();
      
      expect(Clima.findOne).toHaveBeenCalledWith({ 
        where: { nombre: 'Clouds' } 
      });
      
      expect(Clima.create).toHaveBeenCalledWith({
        nombre: 'Clouds',
        descripcion: 'nublado',
        temperatura: 18.0,
        humedad: 75,
        velocidad_viento: 3.5
      });
      
      expect(resultado).toEqual(mockClimaCreado);
    });
    
    it('debería manejar errores de la API correctamente', async () => {
      const errorApi = new Error('API Error');
      (axios.get as jest.Mock).mockRejectedValue(errorApi);
      
      await expect(climaService.obtenerClimaActual('CiudadInexistente'))
        .rejects
        .toThrow('No se pudo obtener el clima');
      
      expect(console.error).toHaveBeenCalledWith(
        'Error al obtener clima actual:', 
        errorApi
      );
      
      expect(Clima.findOne).not.toHaveBeenCalled();
      expect(Clima.create).not.toHaveBeenCalled();
    });
  });
  
  describe('elDiaEstaPara', () => {
    it('debería obtener acciones relacionadas con el clima actual', async () => {
      const mockClima = {
        id: 1,
        nombre: 'Clear',
        descripcion: 'cielo despejado'
      };
      
      const mockAcciones = [
        { id: 1, nombre: 'ir a la playa', clima_id: 1 },
        { id: 2, nombre: 'pasear por el parque', clima_id: 1 },
        { id: 3, nombre: 'hacer un picnic', clima_id: 1 }
      ];
      
      jest.spyOn(climaService, 'obtenerClimaActual').mockResolvedValue(mockClima);
      (Accion.findAll as jest.Mock).mockResolvedValue(mockAcciones);
      
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const [acciones, accionElegida] = await climaService.elDiaEstaPara('Madrid');
      
      expect(climaService.obtenerClimaActual).toHaveBeenCalledWith('Madrid');
      
      expect(Accion.findAll).toHaveBeenCalledWith({ 
        where: { clima_id: 1 } 
      });
      
      expect(acciones).toEqual(mockAcciones);
      
      expect(accionElegida).toEqual(mockAcciones[1]);
      
      randomSpy.mockRestore();
    });
    
    it('debería elegir la primera acción si solo hay una', async () => {
      const mockClima = {
        id: 2,
        nombre: 'Rain',
        descripcion: 'lluvia ligera'
      };
      
      const mockAcciones = [
        { id: 4, nombre: 'quedarse en casa', clima_id: 2 }
      ];
      
      jest.spyOn(climaService, 'obtenerClimaActual').mockResolvedValue(mockClima);
      (Accion.findAll as jest.Mock).mockResolvedValue(mockAcciones);
      
      const [acciones, accionElegida] = await climaService.elDiaEstaPara('Londres');
      
      expect(acciones).toEqual(mockAcciones);
      expect(accionElegida).toEqual(mockAcciones[0]);
    });
    
    it('debería manejar el caso donde no hay acciones para el clima', async () => {
      const mockClima = {
        id: 3,
        nombre: 'Snow',
        descripcion: 'nevando'
      };
      
      const mockAccionesVacias: any[] = [];
      
      jest.spyOn(climaService, 'obtenerClimaActual').mockResolvedValue(mockClima);
      (Accion.findAll as jest.Mock).mockResolvedValue(mockAccionesVacias);
      
      const [acciones, accionElegida] = await climaService.elDiaEstaPara('Oslo');
      
      expect(acciones).toEqual([]);
      expect(accionElegida).toBeUndefined();
    });
    
    it('debería propagar errores de obtenerClimaActual', async () => {
      jest.spyOn(climaService, 'obtenerClimaActual').mockRejectedValue(
        new Error('Error al obtener clima')
      );
      
      await expect(climaService.elDiaEstaPara('CiudadInvalida'))
        .rejects
        .toThrow('No se pudo obtener las acciones');
      
      expect(Accion.findAll).not.toHaveBeenCalled();
    });
    
    it('debería manejar errores al buscar acciones', async () => {
      const mockClima = {
        id: 1,
        nombre: 'Clear'
      };
      
      jest.spyOn(climaService, 'obtenerClimaActual').mockResolvedValue(mockClima);
      (Accion.findAll as jest.Mock).mockRejectedValue(
        new Error('Error en la base de datos')
      );
      
      await expect(climaService.elDiaEstaPara('Madrid'))
        .rejects
        .toThrow('No se pudo obtener las acciones');
      
      expect(console.error).toHaveBeenCalledWith(
        'Error al obtener acciones:', 
        expect.any(Error)
      );
    });
  });
});
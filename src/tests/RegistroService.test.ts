import RegistroService from '../services/registroService';
import Registro from '../models/registro';
import Accion from '../models/accion';
import Clima from '../models/clima';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('../models/registro');
jest.mock('../models/accion');
jest.mock('../models/clima');

describe('RegistroService', () => {
  let registroService: RegistroService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    registroService = new RegistroService();
  });
  
  describe('registrarAccion', () => {
    it('debería crear un registro con los datos correctos', async () => {
      const mockRegistro = {
        id: 1,
        comentario: 'Test comentario',
        accion_id: 2,
        fecha: new Date('2025-04-07')
      };
      
      (Registro.create as jest.Mock).mockResolvedValue(mockRegistro);
      
      const result = await registroService.registrarAccion('Test comentario', 2);
      
      expect(Registro.create).toHaveBeenCalledWith({
        comentario: 'Test comentario',
        accion_id: 2,
        fecha: expect.any(Date)
      });
      
      expect(result).toEqual(mockRegistro);
    });
  });
  
    describe('totalDeAcciones', () => {
      it('debería devolver mensaje cuando no hay registros', async () => {
        (Registro.findAll as jest.Mock).mockResolvedValue([]);
        
        const resultado = await registroService.totalDeAcciones();
        
        expect(resultado).toEqual({ mensaje: 'No hay registros de acciones.' });
        
        expect(Registro.findAll).toHaveBeenCalledWith({
          include: [{
            model: Accion,
            as: 'accion',
            include: [{
              model: Clima,
              as: 'clima'
            }]
          }]
        });
      });
      
      it('debería agrupar registros por tipo de clima correctamente', async () => {
        const mockRegistros = [
          {
            toJSON: () => ({
              id: 1,
              comentario: 'Primer registro',
              accion_id: 1,
              fecha: new Date('2025-04-07'),
              accion: {
                id: 1,
                nombre: 'ir a la playa',
                clima_id: 1,
                clima: {
                  id: 1,
                  nombre: 'Clear'
                }
              }
            })
          },
          {
            toJSON: () => ({
              id: 2,
              comentario: 'Segundo registro',
              accion_id: 2,
              fecha: new Date('2025-04-08'),
              accion: {
                id: 2,
                nombre: 'quedarse en casa',
                clima_id: 2,
                clima: {
                  id: 2,
                  nombre: 'Rain'
                }
              }
            })
          },
          {
            toJSON: () => ({
              id: 3,
              comentario: 'Tercer registro',
              accion_id: 3,
              fecha: new Date('2025-04-09'),
              accion: {
                id: 3,
                nombre: 'ir al cine',
                clima_id: 2,
                clima: {
                  id: 2,
                  nombre: 'Rain'
                }
              }
            })
          }
        ];
        
        (Registro.findAll as jest.Mock).mockResolvedValue(mockRegistros);
        
        const resultado = await registroService.totalDeAcciones();
        
        expect(resultado).toEqual({
          'Clear': {
            count: 1,
            acciones: [
              {
                id: 1,
                nombre: 'ir a la playa',
                fecha: expect.any(Date)
              }
            ]
          },
          'Rain': {
            count: 2,
            acciones: [
              {
                id: 2,
                nombre: 'quedarse en casa',
                fecha: expect.any(Date)
              },
              {
                id: 3,
                nombre: 'ir al cine',
                fecha: expect.any(Date)
              }
            ]
          }
        });
      });
      
      it('debería manejar correctamente registros sin acción', async () => {
        const mockRegistroSinAccion = [
          {
            toJSON: () => ({
              id: 1,
              comentario: 'Registro sin acción',
              accion_id: null,
              fecha: new Date('2025-04-07')
            })
          }
        ];
        
        (Registro.findAll as jest.Mock).mockResolvedValue(mockRegistroSinAccion);
        
        const resultado = await registroService.totalDeAcciones();
        
        expect(Object.keys(resultado).length).toBe(0);
        
        expect(console.log).toHaveBeenCalledWith(
          'Registro sin acción:', 
          1
        );
      });
      
      it('debería manejar correctamente acciones sin clima', async () => {
        const mockRegistroSinClima = [
          {
            toJSON: () => ({
              id: 1,
              comentario: 'Registro con acción sin clima',
              accion_id: 1,
              fecha: new Date('2025-04-07'),
              accion: {
                id: 1,
                nombre: 'acción sin clima',
                clima_id: null
              }
            })
          }
        ];
        
        (Registro.findAll as jest.Mock).mockResolvedValue(mockRegistroSinClima);
        
        const resultado = await registroService.totalDeAcciones();
        
        expect(Object.keys(resultado).length).toBe(0);
        
        expect(console.log).toHaveBeenCalledWith(
          'Acción sin clima:', 
          1
        );
      });
      
      it('debería manejar correctamente climas sin nombre', async () => {
        const mockRegistroClimaSinNombre = [
          {
            toJSON: () => ({
              id: 1,
              comentario: 'Registro con clima sin nombre',
              accion_id: 1,
              fecha: new Date('2025-04-07'),
              accion: {
                id: 1,
                nombre: 'acción con clima sin nombre',
                clima_id: 1,
                clima: {
                  id: 1,
                  nombre: null
                }
              }
            })
          }
        ];
        
        (Registro.findAll as jest.Mock).mockResolvedValue(mockRegistroClimaSinNombre);
        
        const resultado = await registroService.totalDeAcciones();
        
        expect(Object.keys(resultado).length).toBe(0);
        
        expect(console.log).toHaveBeenCalledWith(
          'Clima sin nombre:', 
          1
        );
      });
      
      it('debería manejar correctamente un error en la consulta', async () => {
        const errorMock = new Error('Error en la consulta a la base de datos');
        (Registro.findAll as jest.Mock).mockRejectedValue(errorMock);
        
        await expect(registroService.totalDeAcciones())
          .rejects
          .toThrow('Error en la consulta a la base de datos');
        
        expect(console.error).toHaveBeenCalledWith(
          'Error al obtener total de acciones:', 
          errorMock
        );
      });
      
      it('debería agregar correctamente múltiples acciones del mismo clima', async () => {
        const mockRegistrosMismoClima = [
          {
            toJSON: () => ({
              id: 1,
              comentario: 'Primer registro - Sunny',
              accion_id: 1,
              fecha: new Date('2025-04-07'),
              accion: {
                id: 1,
                nombre: 'ir a la playa',
                clima_id: 1,
                clima: {
                  id: 1,
                  nombre: 'Sunny'
                }
              }
            })
          },
          {
            toJSON: () => ({
              id: 2,
              comentario: 'Segundo registro - Sunny',
              accion_id: 2,
              fecha: new Date('2025-04-08'),
              accion: {
                id: 2,
                nombre: 'hacer picnic',
                clima_id: 1,
                clima: {
                  id: 1,
                  nombre: 'Sunny'
                }
              }
            })
          },
          {
            toJSON: () => ({
              id: 3,
              comentario: 'Tercer registro - Sunny',
              accion_id: 3,
              fecha: new Date('2025-04-09'),
              accion: {
                id: 3,
                nombre: 'pasear en el parque',
                clima_id: 1,
                clima: {
                  id: 1,
                  nombre: 'Sunny'
                }
              }
            })
          }
        ];
        
        (Registro.findAll as jest.Mock).mockResolvedValue(mockRegistrosMismoClima);
        
        const resultado = await registroService.totalDeAcciones();
        
        expect(Object.keys(resultado).length).toBe(1);
        expect(resultado).toHaveProperty('Sunny');
        
        expect(resultado.Sunny.count).toBe(3);
        
        expect(resultado.Sunny.acciones.length).toBe(3);
        
        expect(resultado.Sunny.acciones).toEqual(expect.arrayContaining([
          {
            id: 1,
            nombre: 'ir a la playa',
            fecha: expect.any(Date)
          },
          {
            id: 2,
            nombre: 'hacer picnic',
            fecha: expect.any(Date)
          },
          {
            id: 3,
            nombre: 'pasear en el parque',
            fecha: expect.any(Date)
          }
        ]));
      });
    });
  });
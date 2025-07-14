import dotenv from 'dotenv';
import RegistroEntity from '../../domain/entities/registroEntity';
import { IRegistroRepository } from '../../domain/repositories/registroRepository';
import RegistroRepository from '../../infrastructure/repositories/RegistroRepository';
import { IRegistro } from '../../domain/interfaces/registroInterface';
dotenv.config();

class RegistroService implements IRegistro {
  private registroRepository: IRegistroRepository;

  constructor() {
    this.registroRepository = new RegistroRepository();
  }

  async registrarAccion(comentario: string, accion_id: number): Promise<RegistroEntity> {
    const registroData = await this.registroRepository.registrarAccion(comentario, accion_id);
    return new RegistroEntity(
      registroData.id,
      registroData.comentario,
      registroData.accion_id,
      registroData.fecha
    );
  }

  async totalDeAcciones(): Promise<any> {
    try {
      const registros = await this.registroRepository.findAllWithRelations();

      if (!registros || registros.length === 0) {
        return { mensaje: 'No hay registros de acciones.' };
      }

      const registrosJSON = registros.map(registro => registro.toJSON());
      
      const totalPorClima = registrosJSON.reduce((resultado, registro) => {
        if (!registro.accion) {
          console.log('Registro sin acción:', registro.id);
          return resultado;
        }
        
        if (!registro.accion.clima) {
          console.log('Acción sin clima:', registro.accion.id);
          return resultado;
        }
        
        const nombreClima = registro.accion.clima.nombre;
        
        if (!nombreClima) {
          console.log('Clima sin nombre:', registro.accion.clima.id);
          return resultado;
        }
        
        if (resultado[nombreClima]) {
          resultado[nombreClima].veces_realizada += 1;
          resultado[nombreClima].acciones.push({
            id: registro.accion.id,
            nombre: registro.accion.nombre,
            fecha: registro.fecha
          });
        } else {
          resultado[nombreClima] = {
            veces_realizada: 1,
            acciones: [{
              id: registro.accion.id,
              nombre: registro.accion.nombre,
              fecha: registro.fecha
            }]
          };
        }
        
        return resultado;
      }, {});
      
      return totalPorClima;
    } catch (error) {
      console.error('Error al obtener total de acciones:', error);
      throw error;
    }
  }
}

export default RegistroService;
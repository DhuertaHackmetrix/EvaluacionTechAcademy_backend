import axios from 'axios';
import ClimaEntity from '../../domain/entities/climaEntity';
import AccionEntity from '../../domain/entities/accionEntity';
import { IClimaRepository } from '../../domain/repositories/climaRepository';
import ClimaRepository from '../../infrastructure/repositories/ClimaRepository';
import dotenv from 'dotenv';
import { IClimaService } from '../../domain/interfaces/climaServiceInterface';

dotenv.config();

class ClimaService implements IClimaService {
  private climaRepository: IClimaRepository;

  constructor(climaRepository: IClimaRepository) {
    this.climaRepository = climaRepository;
  }

  async obtenerClimaActual(ciudad: string): Promise<ClimaEntity> {
    const climaData = await this.climaRepository.obtenerClimaActual(ciudad);
    return new ClimaEntity(
      climaData.id,
      climaData.nombre,
      climaData.descripcion,
      climaData.temperatura,
      climaData.humedad,
      climaData.velocidad_viento
    );
  }

  async elDiaEstaPara(ciudad: string): Promise<[AccionEntity[], AccionEntity]> {
    try {
      const climaData = await this.climaRepository.obtenerClimaActual(ciudad);
      const accionesData = await this.climaRepository.findAccionesByClimaId(climaData.id);
      
      const acciones = accionesData.map((accionData: any) =>
        new AccionEntity(
          accionData.id,
          accionData.nombre,
          accionData.descripcion,
          accionData.clima_id,
          accionData.humedad,
          accionData.velocidad_viento
        )
      );

      const accionElegida = acciones[Math.floor(Math.random() * acciones.length)];
      return [acciones, accionElegida];
    } catch (error) {
      console.error('Error al obtener acciones:', error);
      throw error;
    }
  }
}

export default ClimaService;

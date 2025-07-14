import ClimaEntity from '../entities/climaEntity';
import AccionEntity from '../entities/accionEntity';

export interface IClimaService {
  obtenerClimaActual(ciudad: string): Promise<ClimaEntity>;
  elDiaEstaPara(ciudad: string): Promise<[AccionEntity[], AccionEntity]>;
}

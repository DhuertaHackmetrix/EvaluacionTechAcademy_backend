import Accion from '../models/accion';
import Clima from '../models/clima';
export interface IClimaService {
  obtenerClimaActual(ciudad: String): Promise<typeof Clima>;
  elDiaEstaPara(ciudad: String): Promise<[typeof Accion[],any]>;
}

import Clima from '../models/clima';
export interface IClimaService {
  obtenerClimaActual(ciudad: String): Promise<typeof Clima>;
}

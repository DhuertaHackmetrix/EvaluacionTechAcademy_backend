export interface IClimaRepository {
  obtenerClimaActual(ciudad: string): Promise<any>;
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
  findByName(nombre: string): Promise<any>;
  findAccionesByClimaId(climaId: number): Promise<any[]>;
}

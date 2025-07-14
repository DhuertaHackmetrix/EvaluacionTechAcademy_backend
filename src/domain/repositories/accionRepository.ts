export interface IAccionRepository {
  crearAccion(accion: string, nombreClima: string, descripcionAccion: string): Promise<any>;
  leerAccion(id: number): Promise<any>;
  deleteAccion(id: number): Promise<void>;
  updateAccion(id: number, accion: string): Promise<void>;
  getAllAcciones(): Promise<any[]>;
}
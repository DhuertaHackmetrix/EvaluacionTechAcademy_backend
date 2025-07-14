export interface IRegistroRepository {
  registrarAccion(comentario: string, accion_id: number): Promise<any>;
  findAllWithRelations(): Promise<any[]>;
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
}

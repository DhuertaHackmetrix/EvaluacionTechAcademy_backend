export interface IRegistroRepository {
  registrarAccion(comentario: string, accion_id: number): Promise<any>;
  findAllWithRelations(): Promise<any[]>;
  findAll(): Promise<any[]>;
  findById(id: number): Promise<any>;
  findWeeklyRegistrosWithAccion(startDate: Date, endDate: Date): Promise<any[]>;
  countByAccionId(accion_id: number): Promise<number>;
}

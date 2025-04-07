export interface IRegistro {
  registrarAccion(comentario: string, accion_id: number, fecha:Date): Promise<any>;
  totalDeAcciones(): Promise<any>;
  }
  
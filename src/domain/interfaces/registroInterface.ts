import RegistroEntity from '../entities/registroEntity';

export interface IRegistro {
  registrarAccion(comentario: string, accion_id: number): Promise<RegistroEntity>;
  totalDeAcciones(): Promise<any>;
  }

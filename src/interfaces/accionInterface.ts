import Accion from "../models/accion";

export interface IAccion{
    crearAccion(accion: string,nombreClima:string, descripcionAccion:string): Promise<typeof Accion>;
    leerAccion(id: number): Promise<typeof Accion>;
    deleteAccion(id: number): Promise<typeof Accion>;
    updateAccion(id: number, accion: String): Promise<typeof Accion>;
    getAllAcciones(): Promise<typeof Accion[]>;
  }
  
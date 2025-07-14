import AccionEntity from "../entities/accionEntity";

export interface IAccion{
    crearAccion(accion: string, nombreClima: string, descripcionAccion: string): Promise<AccionEntity>;
    leerAccion(id: number): Promise<AccionEntity | null>;
    deleteAccion(id: number): Promise<void>;
    updateAccion(id: number, accion: string): Promise<void>;
    getAllAcciones(): Promise<AccionEntity[]>;
}

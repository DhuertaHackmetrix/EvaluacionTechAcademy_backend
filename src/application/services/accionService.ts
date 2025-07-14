import AccionEntity from '../../domain/entities/accionEntity';
import { IAccionRepository } from '../../domain/repositories/accionRepository';
import AccionRepository from '../../infrastructure/repositories/AccionRepository';
import { IAccion } from '../../domain/interfaces/accionInterface';

class AccionService implements IAccion {
  private accionRepository: IAccionRepository;

  constructor() {
    this.accionRepository = new AccionRepository();
  }

  async crearAccion(accion: string, nombreClima: string, descripcionAccion: string): Promise<AccionEntity> {
    const accionData = await this.accionRepository.crearAccion(accion, nombreClima, descripcionAccion);
    return new AccionEntity(
      accionData.id,
      accionData.nombre,
      accionData.descripcion,
      accionData.clima_id,
      accionData.humedad,
      accionData.velocidad_viento
    );
  }

  async leerAccion(id: number): Promise<AccionEntity | null> {
    const accionData = await this.accionRepository.leerAccion(id);
    if (!accionData) return null;
    return new AccionEntity(
      accionData.id,
      accionData.nombre,
      accionData.descripcion,
      accionData.clima_id,
      accionData.humedad,
      accionData.velocidad_viento
    );
  }

  async deleteAccion(id: number): Promise<void> {
    await this.accionRepository.deleteAccion(id);
  }

  async updateAccion(id: number, accion: string): Promise<void> {
    await this.accionRepository.updateAccion(id, accion);
  }

  async getAllAcciones(): Promise<AccionEntity[]> {
    const accionesData = await this.accionRepository.getAllAcciones();
    return accionesData.map((accionData: any) =>
      new AccionEntity(
        accionData.id,
        accionData.nombre,
        accionData.descripcion,
        accionData.clima_id,
        accionData.humedad,
        accionData.velocidad_viento
      )
    );
  }
}

export default AccionService;
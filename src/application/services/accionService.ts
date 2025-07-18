import AccionEntity from '../../domain/entities/accionEntity';
import { IAccionRepository } from '../../domain/repositories/accionRepository';
import AccionRepository from '../../infrastructure/repositories/AccionRepository';
import { IAccion } from '../../domain/interfaces/accionInterface';
import ClimaEntity from '../../domain/entities/climaEntity';
import { AccionTopDTO } from '../../domain/DTO/AccionTopDTO';
import { IRegistroRepository } from '../../domain/repositories/registroRepository';
import RegistroRepository from '../../infrastructure/repositories/RegistroRepository';
class AccionService implements IAccion {
  private accionRepository: IAccionRepository;
  private registroRepository: IRegistroRepository;

  constructor(
    accionRepository: IAccionRepository,
    registroRepository: IRegistroRepository
  ) {
    this.accionRepository = accionRepository;
    this.registroRepository = registroRepository;
  }

  private calcularPuntaje(accion: AccionEntity, clima: ClimaEntity): number {
    let puntaje = 100;
  
    puntaje -= 2 * Math.abs(accion.humedad - clima.humedad);
    puntaje -= 2 * Math.abs(accion.velocidadViento - clima.velocidadViento);
  
    if (clima.temperatura < 5 || clima.temperatura > 35) {
      puntaje -= 30;
    } else if (clima.temperatura < 15 || clima.temperatura > 28) {
      puntaje -= 10;
    }
  
    // Ejemplo: penaliza si la acción es al aire libre y el clima es extremo
    if (accion.nombre.toLowerCase().includes('aire libre') && (clima.temperatura < 10 || clima.temperatura > 30)) {
      puntaje -= 15;
    }
  
    return Math.max(0, Math.round(puntaje));
  }

async obtenerTopAccionesPorClima(clima: ClimaEntity, top: number = 3): Promise<{ mejores: AccionTopDTO[], peores: AccionTopDTO[] }> {
  const acciones = await this.getAllAcciones();

  const accionesConPuntaje = acciones.map(a => ({
    id: a.id,
    nombre: a.nombre,
    descripcion: a.descripcion,
    puntaje: this.calcularPuntaje(a, clima)
  }));

  accionesConPuntaje.sort((a, b) => b.puntaje - a.puntaje);

  const mejores = accionesConPuntaje.slice(0, top);
  const peores = accionesConPuntaje.slice(-top).sort((a, b) => a.puntaje - b.puntaje);

  return { mejores, peores };
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

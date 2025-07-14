import Accion from '../../domain/models/accion';
import Clima from '../../domain/models/clima';
import { IAccionRepository } from '../../domain/repositories/accionRepository';

class AccionRepository implements IAccionRepository {
  async crearAccion(accion: string, nombreClima: string, descripcionAccion: string): Promise<any> {
    try {
      if (!accion) {
        throw new Error('Accion no puede ser vacio');
      }

      const clima = await Clima.findOne({ where: { nombre: nombreClima } }) as any;
      if (!clima) {
        throw new Error(`No se encontró un clima con el nombre: ${nombreClima}`);
      }

      const clima_id = clima.id;
      const descripcion = descripcionAccion;
      const humedad = clima.humedad || 0;
      const velocidad_viento = clima.velocidad_viento || 0;

      const crearAccion = await Accion.create({
        nombre: accion,
        descripcion,
        clima_id,
        humedad,
        velocidad_viento,
      });
      
      return crearAccion;

    } catch (error) {
      console.error('Error en crearAccion:', error);
      throw error;
    }
  }

  async leerAccion(id: number): Promise<any> {
    if (!id) {
      throw new Error('Id no puede ser vacio');
    }
    const accionData = await Accion.findOne({ where: { id } });
    return accionData;
  }

  async deleteAccion(id: number): Promise<void> {
    if (!id) {
      throw new Error('Id no puede ser vacio');
    }
    await Accion.destroy({ where: { id } });
  }

  async updateAccion(id: number, accion: string): Promise<void> {
    if (!id) {
      throw new Error('Id no puede ser vacio');
    }
    if (!accion) {
      throw new Error('Accion no puede ser vacio');
    }
    await Accion.update({ nombre: accion }, { where: { id } });
  }

  async getAllAcciones(): Promise<any[]> {
    const accionesData = await Accion.findAll();
    return accionesData;
  }
}

export default AccionRepository;
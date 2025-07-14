import axios from 'axios';
import Clima from '../../domain/models/clima';
import Accion from '../../domain/models/accion';
import { IClimaRepository } from '../../domain/repositories/climaRepository';
import dotenv from 'dotenv';

dotenv.config();

class ClimaRepository implements IClimaRepository {
  async obtenerClimaActual(ciudad: string): Promise<any> {
    try {
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
      );
      
      const data = response.data;
      const nombre = data.weather[0].main;
      const descripcion = data.weather[0].description;
      const temperatura = data.main.temp;
      const humedad = data.main.humidity;
      const velocidad_viento = data.wind.speed;

      let clima = await Clima.findOne({ where: { nombre } });

      if (!clima) {
        clima = await Clima.create({
          nombre,
          descripcion,
          temperatura,
          humedad,
          velocidad_viento,
        });
      }

      return clima;

    } catch (error) {
      console.error('Error al obtener clima actual:', error);
      throw new Error('No se pudo obtener el clima');
    }
  }

  async findAll(): Promise<any[]> {
    return await Clima.findAll();
  }

  async findById(id: number): Promise<any> {
    return await Clima.findByPk(id);
  }

  async findByName(nombre: string): Promise<any> {
    return await Clima.findOne({ where: { nombre } });
  }

  async findAccionesByClimaId(climaId: number): Promise<any[]> {
    return await Accion.findAll({ where: { clima_id: climaId } });
  }
}

export default ClimaRepository;
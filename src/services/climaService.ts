import axios from 'axios';
import Clima from '../models/clima';
import Accion from '../models/accion';
import dotenv from 'dotenv';
import { IClimaService } from '../interfaces/climaServiceInterface';

dotenv.config();

class ClimaService implements IClimaService{
  async obtenerClimaActual(ciudad: String): Promise<any> {
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
  async elDiaEstaPara(ciudad: String): Promise<[any[],any]> {
    try {
      const clima = await this.obtenerClimaActual(ciudad);
      const acciones = await Accion.findAll({ where: { clima_id: clima.id } });
      const accionElegida = acciones[Math.floor(Math.random() * acciones.length)];
      return [acciones, accionElegida]; 
    } catch (error) {
      console.error('Error al obtener acciones:', error);
      throw new Error('No se pudo obtener las acciones');
    }
  }
}


export const climaService = new ClimaService();

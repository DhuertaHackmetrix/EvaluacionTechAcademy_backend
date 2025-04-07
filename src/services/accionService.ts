import axios from 'axios';
import Accion from '../models/accion';
import dotenv from 'dotenv';
import { IAccion } from '../interfaces/accionInterface';
import Clima from '../models/clima';
dotenv.config();

class AccionService implements IAccion{
    async crearAccion(accion: string, nombreClima: string, descripcionAccion:string): Promise<any> {
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

    leerAccion(id: number): Promise<any> {
        if(!id) {
            throw new Error('Id no puede ser vacio');
        }
        const leerAccion=Accion.findOne({where:{id}});
        return leerAccion;
    }
    
    deleteAccion(id: number): Promise<any> {
        if(!id) {
            throw new Error('Id no puede ser vacio');
        }
        const deleteAccion=Accion.destroy({where:{id}});
        return deleteAccion;
    }

   async updateAccion(id: number, accion: string): Promise<any> {
        if (!id) {
            throw new Error('Id no puede ser vacio');
        }
        if (!accion) {
            throw new Error('Accion no puede ser vacio');
        }
        const updateAccion = await Accion.update(
            { nombre: accion },{where:{id}});
        return updateAccion;
    }
    
    
    getAllAcciones(): Promise<any> {
        const getAllAcciones=Accion.findAll();
        return getAllAcciones;
    }

}

export default AccionService;
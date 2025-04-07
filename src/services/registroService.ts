import axios from 'axios';
import dotenv from 'dotenv';
import { IRegistro } from '../interfaces/registroInterface';
import Registro from '../models/registro';
import Accion from '../models/accion';
import Clima from '../models/clima';
dotenv.config();

class RegistroService implements IRegistro{
    async registrarAccion(comentario: string,accion_id: number ): Promise<any> {
        try {
            const registro = await Registro.create({
                comentario,
                accion_id,
                fecha: new Date(),
            });
            return registro;
        }
        catch (error) {
            console.error('Error al registrar Accion:', error);
            throw error;
        }
    }
    async totalDeAcciones(): Promise<any> {
        try {
            const registros = await Registro.findAll({
                include: [{
                    model: Accion,
                    as: 'accion',
                    include: [{
                        model: Clima,
                        as: 'clima'
                    }]
                }]
            });
    
            if (!registros || registros.length === 0) {
                return { mensaje: 'No hay registros de acciones.' };
            }
    
            const registrosJSON = registros.map(registro => registro.toJSON());
            
            console.log('Ejemplo de registro convertido:', 
                registrosJSON.length > 0 ? JSON.stringify(registrosJSON[0], null, 2) : 'No hay registros');
    
            const totalPorClima = registrosJSON.reduce((resultado, registro) => {
                if (!registro.accion) {
                    console.log('Registro sin acción:', registro.id);
                    return resultado;
                }
                
                if (!registro.accion.clima) {
                    console.log('Acción sin clima:', registro.accion.id);
                    return resultado;
                }
                
                const nombreClima = registro.accion.clima.nombre;
                
                if (!nombreClima) {
                    console.log('Clima sin nombre:', registro.accion.clima.id);
                    return resultado;
                }
                
                if (resultado[nombreClima]) {
                    resultado[nombreClima].count += 1;
                    resultado[nombreClima].acciones.push({
                        id: registro.accion.id,
                        nombre: registro.accion.nombre,
                        fecha: registro.fecha
                    });
                } else {
                    // Si no existe, crear una nueva entrada para este clima
                    resultado[nombreClima] = {
                        count: 1,
                        acciones: [{
                            id: registro.accion.id,
                            nombre: registro.accion.nombre,
                            fecha: registro.fecha
                        }]
                    };
                }
                
                return resultado;
            }, {}); // Iniciar con un objeto vacío como acumulador
            
            return totalPorClima;
        } catch (error) {
            console.error('Error al obtener total de acciones:', error);
            throw error;
        }
    }
}

export default RegistroService;
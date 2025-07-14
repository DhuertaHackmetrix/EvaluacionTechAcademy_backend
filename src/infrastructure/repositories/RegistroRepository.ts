import Registro from '../../domain/models/registro';
import Accion from '../../domain/models/accion';
import Clima from '../../domain/models/clima';
import { IRegistroRepository } from '../../domain/repositories/registroRepository';

class RegistroRepository implements IRegistroRepository {
  async registrarAccion(comentario: string, accion_id: number): Promise<any> {
    try {
      const registro = await Registro.create({
        comentario,
        accion_id,
        fecha: new Date(),
      });
      return registro;
    } catch (error) {
      console.error('Error al registrar Accion:', error);
      throw error;
    }
  }

  async findAllWithRelations(): Promise<any[]> {
    return await Registro.findAll({
      include: [{
        model: Accion,
        as: 'accion',
        include: [{
          model: Clima,
          as: 'clima'
        }]
      }]
    });
  }

  async findAll(): Promise<any[]> {
    return await Registro.findAll();
  }

  async findById(id: number): Promise<any> {
    return await Registro.findByPk(id);
  }
}

export default RegistroRepository;
import Registro from '../../domain/models/registro';
import Accion from '../../domain/models/accion';
import Clima from '../../domain/models/clima';
import { IRegistroRepository } from '../../domain/repositories/registroRepository';
import { Op, fn, col } from 'sequelize';

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

async findWeeklyRegistrosWithAccion(startDate: Date, endDate: Date): Promise<any[]> {
  return await Registro.findAll({
      attributes: [
        [fn('COUNT', col('registros.id')), 'totalVeces'],
        [col('accion.nombre'), 'accionNombre'],
      ],
    include: [{
      model: Accion,
      as: 'accion',
      attributes: [],
    }],
    where: {
      fecha: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [col('accion.nombre')],
    raw: true,
  });
}

  async countByAccionId(accion_id: number): Promise<number> {
    return await Registro.count({
      where: { accion_id },
    });
  }
}

export default RegistroRepository;

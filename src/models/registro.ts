import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Registro = sequelize.define('registros', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  comentario: { type: DataTypes.STRING, allowNull: false },
  accion_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: 'acciones', key: 'id' }
  },
  fecha: { type: DataTypes.DATE, allowNull: false },
});

export default Registro;
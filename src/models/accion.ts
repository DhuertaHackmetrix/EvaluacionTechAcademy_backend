import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Clima from './clima';

const Accion = sequelize.define('acciones', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING, allowNull: false },
  clima_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: 'climas', key: 'id' }  // Asegúrate de que 'climas' esté correcto
  },
  humedad: { type: DataTypes.FLOAT, allowNull: false },
  velocidad_viento: { type: DataTypes.FLOAT, allowNull: false },
});

export default Accion;

import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Clima = sequelize.define('climas', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING, allowNull: false },
  temperatura: { type: DataTypes.FLOAT, allowNull: false },
  humedad: { type: DataTypes.FLOAT, allowNull: false },
  velocidad_viento: { type: DataTypes.FLOAT, allowNull: false },
});

export default Clima;

import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const Accion = sequelize.define('Acciones', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false },
    clima_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: 'climas', key: 'id' }
    },
    humedad: { type: DataTypes.FLOAT, allowNull: false },
    velocidad_viento: { type: DataTypes.FLOAT, allowNull: false },
  });
  
  export default Accion;
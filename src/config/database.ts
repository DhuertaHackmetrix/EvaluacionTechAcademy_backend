import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'tiempo_bd', 
  username: 'root', 
  password: 'diego123', 
  host: '127.0.0.1', 
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
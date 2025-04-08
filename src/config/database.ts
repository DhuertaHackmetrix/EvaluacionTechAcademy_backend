import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  database: 'tiempo_bd', 
  username: process.env.USER_BD_NAME, 
  password: process.env.USER_BD_PASSWORD, 
  host: process.env.BD_HOST, 
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
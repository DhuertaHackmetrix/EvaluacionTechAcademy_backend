import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export async function createDatabaseIfNotExist() {
  try {
    const tempSequelize = new Sequelize('', process.env.USER_BD_NAME!, process.env.USER_BD_PASSWORD!, {
      host: process.env.BD_HOST,
      dialect: 'mysql',
      logging: false,
    });

    await tempSequelize.query('CREATE DATABASE IF NOT EXISTS tiempo_bd;');
    console.log('✅ Base de datos creada o ya existe');

    await tempSequelize.close();
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error);
    throw error;
  }
}

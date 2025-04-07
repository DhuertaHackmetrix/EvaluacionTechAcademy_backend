import sequelize from './config/database';
import './models/clima'; 
import './models/accion';
import './models/registro';
import './models/relaciones';
import express from 'express';
import climaRoutes from './routes/climaRoutes';
import dotenv from 'dotenv';
dotenv.config();

async function createDatabaseIfNotExist() {
  try {
    await sequelize.query('CREATE DATABASE IF NOT EXISTS tiempo_bd;');
    console.log('✅ Base de datos creada o ya existe');
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error);
  }
}

const app = express();
app.use(express.json());

// Rutas
app.use('/api', climaRoutes);

(async () => {
  try {
    await createDatabaseIfNotExist();

    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas con éxito');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
})();
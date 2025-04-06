import sequelize from './config/database';
import './models/clima'; 
import './models/accion';
import './models/registro';
import express from 'express';
import climaRoutes from './routes/climaRoutes';

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
    // Crear la base de datos si no existe
    await createDatabaseIfNotExist();

    // Autenticar la conexión con la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    // Sincronizar todos los modelos con las relaciones
    await sequelize.sync({ force: true }); // Cambia a `force: false` en producción
    console.log('✅ Tablas sincronizadas con éxito');

    // Levantar la aplicación
    const PORT = process.env.PORT || 3000; // Usa el puerto definido en las variables de entorno o 3000 por defecto
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
})();
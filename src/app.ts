import sequelize from './config/database';
import './models/clima'; 
import './models/accion';
import './models/registro';

async function createDatabaseIfNotExist() {
  try {
    await sequelize.query('CREATE DATABASE IF NOT EXISTS tiempo_bd;');
    console.log('✅ Base de datos creada o ya existe');
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error);
  }
}

(async () => {
  try {
    await createDatabaseIfNotExist();

    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    // Sincronizar todos los modelos con las relaciones
    await sequelize.sync({ force: true }); // Cambia a `force: false` en producción
    console.log('✅ Tablas sincronizadas con éxito');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
})();
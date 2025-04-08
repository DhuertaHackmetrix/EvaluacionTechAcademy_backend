import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { createDatabaseIfNotExist} from './config/init';
import './models/clima';
import './models/accion';
import './models/registro';
import './models/relaciones';

import climaRoutes from './routes/climaRoutes';

// ⛔ importa sequelize DESPUÉS de crear la base de datos
import sequelize from './config/database';

const app = express();
app.use(express.json());
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
    console.error('❌ Error al iniciar la app:', error);
  }
})();

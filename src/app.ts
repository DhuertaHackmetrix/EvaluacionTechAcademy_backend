import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { createDatabaseIfNotExist} from './config/init';
import './domain/models/clima';
import './domain/models/accion';
import './domain/models/registro';
import './domain/models/relaciones';

import climaRoutes from './routes/climaRoutes';
import emailRoutes from './routes/emailRoutes';

// ⛔ importa sequelize DESPUÉS de crear la base de datos
import sequelize from './config/database';

const app = express();
app.use(express.json());
app.use('/api/clima', climaRoutes);
app.use('/api/email', emailRoutes);

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

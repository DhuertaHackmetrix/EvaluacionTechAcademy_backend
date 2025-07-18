import express from 'express';
import dotenv from 'dotenv';
import type { ErrorRequestHandler } from 'express';
dotenv.config();

import { createDatabaseIfNotExist} from './config/init';
import './domain/models/clima';
import './domain/models/accion';
import './domain/models/registro';
import './domain/models/relaciones';
import './jobs/emailJobs';

import climaRoutes from './routes/climaRoutes';
import emailRoutes from './routes/emailRoutes';

import sequelize from './config/database';

const app = express();

app.use(express.json());




app.use('/api', climaRoutes);
app.use('/api/email', emailRoutes);


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('❌ Error de JSON parsing:', err.message);
    res.status(400).json({
      error: 'JSON malformado',
      mensaje: 'Por favor verifica que el JSON esté bien formateado',
      detalles: err.message
    });
    return;
  }

  next(err);
};


app.use(errorHandler);

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
  } catch (err) {
    console.error('❌ Error al iniciar la app:', err);
  }
})();

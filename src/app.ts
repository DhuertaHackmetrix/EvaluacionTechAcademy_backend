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

// Middleware para JSON parsing con mejor manejo de errores
app.use(express.json());

// Middleware para manejar errores de JSON parsing
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    console.error('❌ Error de JSON parsing:', error.message);
    return res.status(400).json({ 
      error: 'JSON malformado', 
      mensaje: 'Por favor verifica que el JSON esté bien formateado',
      detalles: error.message
    });
  }
  next();
});

app.use('/api', climaRoutes);
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

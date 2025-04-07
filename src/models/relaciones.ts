import Accion from './accion';
import Clima from './clima';
import Registro from './registro';

// Definir las asociaciones
Accion.belongsTo(Clima, { 
    foreignKey: 'clima_id', 
    as: 'clima'  // Este alias debe coincidir con lo que usas en tus includes
});

Registro.belongsTo(Accion, { 
    foreignKey: 'accion_id', 
    as: 'accion'  // Este alias debe coincidir con lo que usas en tus includes
});

// También puedes definir las relaciones inversas (opcionales)
Clima.hasMany(Accion, { 
    foreignKey: 'clima_id', 
    as: 'acciones' 
});

Accion.hasMany(Registro, { 
    foreignKey: 'accion_id', 
    as: 'registros' 
});

export default { Accion, Clima, Registro };
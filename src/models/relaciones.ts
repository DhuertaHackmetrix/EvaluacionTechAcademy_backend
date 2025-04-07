import Accion from './accion';
import Clima from './clima';
import Registro from './registro';

Accion.belongsTo(Clima, { 
    foreignKey: 'clima_id', 
    as: 'clima' 
});

Registro.belongsTo(Accion, { 
    foreignKey: 'accion_id', 
    as: 'accion' 
});

Clima.hasMany(Accion, { 
    foreignKey: 'clima_id', 
    as: 'acciones' 
});

Accion.hasMany(Registro, { 
    foreignKey: 'accion_id', 
    as: 'registros' 
});

export default { Accion, Clima, Registro };
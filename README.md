# Proyecto de API de Clima y Actividades

## Descripción
Esta API proporciona recomendaciones de actividades basadas en el clima actual de una ciudad. Permite a los usuarios obtener datos meteorológicos, acceder a actividades recomendadas según el clima, y registrar estas actividades.

## Características
- Consulta de datos meteorológicos en tiempo real a través de OpenWeatherMap API
- Recomendaciones de actividades basadas en condiciones climáticas
- Sistema de registro de actividades realizadas
- Listado de actividades agrupadas por tipo de clima
- API RESTful completa (CRUD) para gestionar actividades

## Tecnologías Utilizadas
- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: MySQL con Sequelize ORM
- **Testing**: Jest para pruebas unitarias e integración
- **APIs Externas**: OpenWeatherMap para datos meteorológicos

## Instalación

git clone https://github.com/tuusuario/EvaluacionTechAcademy_backend.git

cd EvaluacionTechAcademy_backend

npm install 

Configuración

Crea un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=3000
OPENWEATHERMAP_API_KEY=tu_api_key_aquí

Asegúrate de tener MySQL instalado y ejecutándose en tu sistema

# Ejecucion de tests
npm run test:watch

# Ejecución
npm run dev



Estructura del Proyecto

Endpoints de la API

Clima

POST /api/obtenerClimas - Obtiene el clima actual de una ciudad
en Body:
{"ciudad":"nombre_ciudad"}
{"ciudad":"santiago"}

POST /api/elDiaEstaPara/:ciudad - Recomienda actividades según el clima de la ciudad

Acciones

POST /api/crearAccion - Crea una nueva acción
{ "accion":"vacilar",
"nombreClima":"clear",
"descripcionAccion":"carretito" }

GET /api/leerAccion/:id - Obtiene detalles de una acción

DELETE /api/deleteAccion/:id - Elimina una acción

POST /api/updateAccion/:id - Actualiza una acción existente
{ "accion": "ir al bosque" }

GET /api/getAllAcciones - Obtiene todas las acciones disponibles

Registros

POST /api/RegistrarAccion - Registra una acción realizada

GET /api/totalDeAcciones - Obtiene estadísticas de acciones agrupadas por clima

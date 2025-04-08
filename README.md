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
USER_BD_NAME=""
USER_BD_PASSWORD=""
BD_HOST="127.0.0.1"

indicar las variables para su sistema

Asegúrate de tener MySQL instalado y ejecutándose en tu sistema


# Ejecucion de tests
npm run test:watch

# Ejecución
npm run dev


# Flujo inicial

1.al ejecutar el comando inicial se creara automatica la base de datos en mysql, debe tener mysql instalado y corriendo.

2.Obtener climas, para obtener los climas debe llamar a la api /obtenerClimas especificada abajo y usar distintas ciudades, al realizar esto se crearan climas(Clouds,Clear,Rain)segun el tiempo en esa ciudad.

3.Una vez teniendo todos los climas puede empezar a crear las acciones a realizar para cada clima segun indica la api /crearAccion ademas tener en cuenta que nombre_clima puede ser clouds,clear,rain como los mas comunes que entrega la api externa.

4.Una vez realizado todo lo anterior puede utilizar la api /elDiaEstaPara/:ciudad y mostrara las acciones disponibles segun el clima de esa ciudad y elegira una aleatoriamente y la registrara

Ejemplo completo:




# Endpoints de la API

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



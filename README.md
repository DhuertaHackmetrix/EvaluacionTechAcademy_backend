# Proyecto de API de Clima y Actividades

## Descripción
Esta API proporciona recomendaciones de actividades basadas en el clima actual de una ciudad. Permite a los usuarios obtener datos meteorológicos, acceder a actividades recomendadas según el clima, y registrar estas actividades. Además, cuenta con un sistema de notificaciones por correo electrónico que envía resúmenes diarios y semanales.

## Características
- Consulta de datos meteorológicos en tiempo real a través de OpenWeatherMap API
- Recomendaciones de actividades basadas en condiciones climáticas
- Sistema de registro de actividades realizadas
- Listado de actividades agrupadas por tipo de clima
- API RESTful completa (CRUD) para gestionar actividades
- Envío de correos electrónicos con resúmenes diarios y semanales

## Tecnologías Utilizadas
- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: MySQL con Sequelize ORM
- **Testing**: Jest para pruebas unitarias e integración
- **APIs Externas**: OpenWeatherMap para datos meteorológicos
- **Servicio de Correos**: SendGrid

## Instalación

git clone https://github.com/tuusuario/EvaluacionTechAcademy_backend.git

cd EvaluacionTechAcademy_backend

npm install 

## Configuración

Crea un archivo .env ver .env.example en la raíz del proyecto con las siguientes variables:
en caso de no tener la apikey solicitarla a Diego Huerta 
PORT=3000
OPENWEATHERMAP_API_KEY=tu_api_key_de_openweathermap
SENDGRID_API_KEY=tu_api_key_de_sendgrid
USER_BD_NAME=""
USER_BD_PASSWORD=""
BD_HOST="127.0.0.1"

indicar las variables para su sistema

Asegúrate de tener MySQL instalado y ejecutándose en tu sistema


# Ejecucion de tests
npm test


# Ejecución
npm run dev


# Flujo inicial

1.al ejecutar el comando inicial se creara automatica la base de datos en mysql, debe tener mysql instalado y corriendo.

2.Obtener climas, para obtener los climas debe llamar a la api /obtenerClimas especificada abajo y usar distintas ciudades, al realizar esto se crearan climas(Clouds,Clear,Rain)segun el tiempo en esa ciudad. fijarse bien dado que puede que en varias ciudades este el mismo clima y por ende no se cree el clima.

3.Una vez teniendo todos los climas puede empezar a crear las acciones a realizar para cada clima segun indica la api /crearAccion ademas tener en cuenta que nombre_clima puede ser clouds,clear,rain como los mas comunes que entrega la api externa.

4.Una vez realizado todo lo anterior puede utilizar la api /elDiaEstaPara/:ciudad y mostrara las acciones disponibles segun el clima de esa ciudad y elegira una aleatoriamente y la registrara, o usar la api /totalDeAcciones

Ejemplo completo:




# Endpoints de la API

## Clima

POST /api/obtenerClimas - Obtiene el clima actual de una ciudad
en Body:
```json
{"ciudad":"santiago"}
```

Ejemplo de uso:
```json
{"ciudad":"nombre_ciudad"}
```

POST /api/elDiaEstaPara/:ciudad - Recomienda actividades según el clima de la ciudad 

## Acciones

POST /api/crearAccion - Crea una nueva acción
{ "accion":"vacilar",
"nombreClima":"clear",
"descripcionAccion":"carretito" }

GET /api/leerAccion/:id - Obtiene detalles de una acción

DELETE /api/deleteAccion/:id - Elimina una acción

POST /api/updateAccion/:id - Actualiza una acción existente
{ "accion": "ir al bosque" }

GET /api/getAllAcciones - Obtiene todas las acciones disponibles

## Registros

POST /api/RegistrarAccion - Registra una acción realizada

GET /api/totalDeAcciones - Obtiene estadísticas de acciones agrupadas por clima

## Correos

### Jobs automáticos

Al iniciar el servidor, se programan dos jobs automáticos para el envío de correos:

*   **Resumen diario:** Se envía todos los días a las 8:00 AM.
*   **Resumen semanal:** Se envía todos los lunes a las 8:00 AM.

Estos jobs tienen un destinatario y una ciudad fijos que se pueden configurar en el archivo `src/jobs/emailJobs.ts`.

### Endpoints de suscripción

Además de los jobs automáticos, se pueden crear suscripciones a través de los siguientes endpoints:

POST /api/email/send-welcome - Envía un correo de bienvenida
```json
{
  "email": "destinatario@example.com"
}
```

POST /api/email/send-daily-summary - Envía un resumen diario de actividades
```json
{
  "email": "destinatario@example.com",
  "ciudad": "santiago"
}
```

POST /api/email/send-weekly-summary - Envía un resumen semanal de actividades
```json
{
  "email": "destinatario@example.com"
}

# Flujo de utilización de los endpoints

1.  **Obtener climas:**
    *   `POST http://localhost:3000/api/obtenerClimas`
    *   Body: `{"ciudad": "santiago"}`
2.  **Crear acciones:**
    *   `POST http://localhost:3000/api/crearAccion`
    *   Body: `{"accion": "ir a la playa", "nombreClima": "clear", "descripcionAccion": "disfrutar del sol"}`
3.  **Obtener recomendaciones:**
    *   `POST http://localhost:3000/api/elDiaEstaPara/santiago`
4.  **Registrar acciones:**
    *   `POST http://localhost:3000/api/RegistrarAccion`
    *   Body: `{"accionId": 1, "comentario": "fue un buen día"}`
5.  **Obtener estadísticas:**
    *   `GET http://localhost:3000/api/totalDeAcciones`
6.  **Enviar correo de bienvenida:**
    *   `POST http://localhost:3000/api/email/send-welcome`
    *   Body: `{"email": "destinatario@example.com"}`
7.  **Suscribirse al resumen diario:**
    *   `POST http://localhost:3000/api/email/send-daily-summary`
    *   Body: `{"email": "destinatario@example.com", "ciudad": "santiago"}`
8.  **Suscribirse al resumen semanal:**
    *   `POST http://localhost:3000/api/email/send-weekly-summary`
    *   Body: `{"email": "destinatario@example.com"}`

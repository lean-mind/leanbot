# LeanBot para Slack
Pet proyect de un bot para el Slack de LeanMind 💙

----------------

## Índice

- [Instalación](#instalación)
  - [Variables de entorno](#variables-de-entorno)
  - [Bot](#bot)
  - [MongoDB](#mongodb)
  - [TheCatAPI](#thecatapi)
- [Scripts](#scripts)
- [Trabajo en local](#trabajo-en-local)
- [Despliegue](#despliegue)
- [Estructura](#estructura)
- [Recursos](#recursos)


### **Docs**

- [Página de documentos](https://github.com/lean-mind/leanbot/tree/master/docs)
- [Funcionalidades](https://github.com/lean-mind/leanbot/blob/master/docs/features.md)

----------------

## Instalación

### **Variables de entorno**
Necesitas el fichero `.env` en la raiz del proyecto, puedes duplicar el fichero `.env.sample` y modificar los valores:

```
# Api
API_PORT               // El puerto por el que se levantará express para los comandos
MAINTENANCE            // Si está en true, las peticiones que se hagan a la Api, devolverá un mensaje indicando que está en mantenimiento

# Slack
SLACK_SIGNING_SECRET   // El 'Signing secret' de slack, sin este secret no se ejecutará ningún comando

# Bot
BOT_TOKEN              // Token de la aplicación de Slack (Bot Clasico) empieza por "xoxb"
BOT_NAME               // Nombre que tendrá el Bot por defecto
BOT_DISCONNECT         // El estado del bot, on u off, por defecto false, es decir, conectado

# MongoDB
MONGODB_DATABASE       // El nombre de la base de datos que se utilizará en mongodb
MONGODB_URI            // La URI para conectar con la base de datos

# TheCatAPI
CAT_TOKEN              // El token de TheCatAPI para consumir imágenes de gatitos :3
```

### **Bot**

Para obtener el `BOT_TOKEN` hay que crear una aplicación de slack en [api.slack.com/apps](https://api.slack.com/apps)

Una vez creado el bot, deberías estar en las sección **Basic Information** tendrás un desplegable "**Add features and functionality**", entraremos en donde dice **Bot** y te redireccionará a la sección **App Home** donde actualizaremos los scopes dándole al botón en verde "Review Scopes to Add". Vamos al apartado de **Scopes** y añadiremos los siguientes **Bot Token Scopes** en base a los métodos que estamos consumiendo de Slack:

Method   | Bot Scopes
---------|-----------
[`/chat.postMessage`](https://api.slack.com/methods/chat.postMessage) | `chat:write`
[`/conversations.members`](https://api.slack.com/methods/conversations.members) | `channels:read`, `groups:read`, `im:read`, `mpim:read`
[`/views.open`](https://api.slack.com/methods/views.open) | _No scope required_ 

Una vez tengamos los _scopes_ actualizados, podremos instalar el bot en nuestro _workspace_, podremos hacerlo al principio de la misma página donde actualizaste los _scopes_. Ya tendrémos disponible el token del bot que debería comenzar por `xoxb`.

Ahora, para poder consumir nuestras funcionalidades nos faltaría crear los **Slash Commands** y el **Interactivity** command. Para ello vamos al apartado de **Slash Commands* en el menú izquierdo donde podremos crear nuestros comandos, rellenaremos todos los campos necesarios con los comandos que tenemos en la [documentación de funcionalidades](https://github.com/lean-mind/leanbot/blob/master/docs/features.md). 

Teniendo los **Slash Commands** tendríamos que ir al apartado **Interactivity** para añadir un último endpoint `{URL}/interactive`, donde dice **Request URL**. Éste se utilizará para los comandos con "varios pasos", es decir, que si lanzas un comando y te devuelve un modal o un mensaje interactivo en el que tendrás que introducir información o habrán botones con acciones, irán a tráves del endpoint de **Interactivity**, para diferenciarlos, estamos utilizando el `external_id` para identificar el siguiente paso que deberá hacer.

Si revisas en el apartado **Basic Information** deberías tener los slash commands, los bots y los permisos marcados además de la app instalada en tu workspace de desarrollo. También tendrás el `SLACK_SIGNING_SECRET` que equivale al **Verification Token**

### **TheCatAPI**

Estamos utilizando [TheCatAPI](https://thecatapi.com) para obtener imágenes aleatorias de gatitos, con ponerlo en producción sería suficiente, si no está el token, devolverá siempre la misma url de una imagen. Creándote una cuenta en [TheCatAPI](https://thecatapi.com) podrás obtener el token.

----------------

## Scripts

Tenemos estos scripts:
```
build        // Genera la carpeta dist
start        // Arranca la app
start:dev    // Arranca la app y se actualizará al guardar 
test         // Lanza los tests 
test:watch   // Lanza los tests y se relanzarán al guardar 
```

Si nunca has utilizado node, se arrancarían utilizando el comando `npm run <script>` siendo script uno de los anteriores mencionados

----------------

## Trabajo en local

1. Clonar el repositorio
1. Configurar el `.env` haciendo una copia de `.env.sample` y actualizando las variables.
1. Instalar los paquetes de node con `npm install` 
1. Exponer tu ip local para poder acceder a los comandos desde slack (se recomienda [`ngrok`](https://ngrok.com))
1. Actualizar los slash commands y el endpoint de interactive con la url que te da `ngrok`
1. Levantar la base de datos con docker `docker-compose up database` (no tiene seguridad user-pass)
1. Arrancar la aplicación en watch `npm run start:dev`

----------------

## Despliegue

1. Clonar el repositorio
1. Configurar el `.env.prod`
1. Levantar todo con docker `docker-compose up`

----------------

## Estructura

- **actions**: Las acciones programadas, los endpoints y la interactividad harán las acciones que hay en esta carpeta, dependiendo de la acción
- **models**: Aquí están los Modelos de datos, DTOs e Interfaces
- **scheduler**: Aquí es donde se realizarán las acciones programadas
- **services**
  - **api**: Los slash commands y la interactividad entrarán a través de la API
  - **cat**: El servicio que nos proporciona imágenes de gatos
  - **database**: Es donde se accederá a la base de datos
    - **mongodb**: Es la implementación de la base de datos que estamos utilizando actualmente
  - **file**: Es el servicio que se encargará de escribir en ficheros
  - **i18n**: Aquí se encontrará todo lo relacionado con los textos y traducciones de la aplicación
  - **logger**: Aquí están todos los logs para tener un control de lo que va sucediendo en la aplicación
  - **schedule**: Es donde se crearán las fechas o intervalos de las acciones programadas
  - **slack**: Es el que conecta con slack a través de los endpoints
    - **methods**: Aquí estarán todos los métodos que utilizaremos de slack
    - **views**: Son objetos que slack reconocerá como vistas
- **tests**: Aquí están principalmente los builders de los tests que están con sus respectivos servicios

----------------

## Recursos
- Slack API: https://api.slack.com/
  - Methods: https://api.slack.com/methods
- Emojis para Slack (nombres): https://emojipedia.org/slack

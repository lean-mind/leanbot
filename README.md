# LeanBot para Slack

_Pet Project de un bot para el Slack de LeanMind 💙_

![Statement coverage](coverage/badge-statements.svg)
![Branch coverage](coverage/badge-branches.svg)
![Function coverage](coverage/badge-functions.svg)
![Line coverage](coverage/badge-lines.svg)
<a href="https://www.repostatus.org/#active"><img src="https://www.repostatus.org/badges/latest/active.svg" alt="Project Status: Active – The project has reached a stable, usable state and is being actively developed." /></a>
![MIT License](https://img.shields.io/github/license/elangosundar/awesome-README-templates?color=2b9348)

## Índice

- [LeanBot para Slack](#leanbot-para-slack)
  - [Índice](#índice)
  - [Introducción](#Introducción)
  - [Uso/Ejemplos](#Uso/Ejemplos)
    - [CoffeeRoulette](#CoffeeRoulette)
    - [Thanks](#Thanks)
  - [Tech Stack](#Tech Stack)
  - [Docs](#Docs)
  - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Bot](#bot)
    - [heCatAPI](#thecatapi)
  - [Scripts](#scripts)
  - [Trabajo en local](#trabajo-en-local)
  - [Despliegue](#despliegue)
  - [Estructura](#estructura)
  - [Authors](#Authors)
  - [Recursos](#recursos)
  - [Licencia](#Licencia)

----------------

# Introducción

LeanBot nace con la finalidad de darle vida a tu servidor de Slack.
Posee varios comandos que te ayudarán a interactuar con tus compañeros ya sea
agradeciéndoles alguna buena acción o invitándoles a un café (COVID free), aunque no todo
requiere una interacción con los demás, también puedes añadirte tareas a una
lista para no olvidarte de lo que tienes que hacer (WIP :construction:).

¿Y ya está? Por supuesto que no, contamos con un resumen semanal que te llegará todos los
lunes a las 8:00 AM (9:00 AM en horario de verano) con las gracias dadas y recibidas acompañado
de un amigo peludito :smiley_cat:


## Uso/Ejemplos

### CoffeeRoulette

Este comando existe con la finalidad de despejarte unos minutillos del trabajo y
reunirte con tus compañeros de trabajo para conocerse mejor. Su uso es muy simple:

Invoca el comando escribiendo `/coffee-roulette` en cualquier canal donde esté el bot.
Opcionalmente puedes añadir un mensaje:

```sh
/coffee-roulette Tengo 10 minutos libres ¿Te apetece un café? 
```

De forma completamente aleatoria se elegirá un usuario disponible (conectado y no ausente)
en Slack para tomar un café. A ti se te informará que se está buscando gente para tomarse
un café mientras que al usuario elegido se le informará que le ha llegado un café de tu parte. Dicho usuario podrá aceptar o rechazar el café.
Si rechazan tu café, lo puedes volver a intentar.

***IMPORTANTE* →** Si el usuario aleatorio elegido rechaza cualquier café, será de manera
completamente **anónima** y no se le notificará a nadie tu nombre

### Thanks

Se invoca el comando escribiendo en Slack `/thanks` donde esté presente el LeanBot.
Tras usar el comando se abre un modal (ventana de Slack) en el cual debes especificar
a quién/quienes le vas a dar las gracias (pueden ser todos los miembros de un canal)
y un mensaje. LeanBot además te permite dar las gracias de forma completamente anónima
si lo deseas haciendo click en el recuadro Anónimo. Si lo deseas también puedes
publicar las gracias en un canal concreto.

```sh
/thanks 
```

## Tech Stack

**Server:** Node, Express, TypeScript

**Libraries:** Morgan, Axios, CORS, i18n, MongoDb, Node-schedule, Jest, SuperTest

### Docs

- [Página de documentos](https://github.com/lean-mind/leanbot/tree/master/docs)
- [Funcionalidades](https://github.com/lean-mind/leanbot/blob/master/docs/features.md)

----------------

## Instalación

### Variables de entorno

Necesitas el fichero `.env` en la raíz del proyecto, puedes duplicar el fichero `.env.sample` y modificar los valores:

```bash
# Api
API_PORT               # El puerto por el que se levantará express para los comandos
MAINTENANCE            # Si está en true, las peticiones que se hagan a la Api, devolverá un mensaje indicando que está en mantenimiento

# Slack
SLACK_SIGNING_SECRET   # El 'Signing secret' de slack, sin este secret no se ejecutará ningún comando
SLACK_TOKEN            # Token de la aplicación de Slack, empieza por "xoxb"
SLACK_USER_TOKEN       # Token de usuario de la aplicación de Slack, empieza por "xoxp"

# MongoDB
MONGODB_DATABASE       # El nombre de la base de datos que se utilizará en mongodb
MONGODB_URI            # La URI para conectar con la base de datos

# TheCatAPI
CAT_TOKEN              # El token de TheCatAPI para consumir imágenes de gatitos :3

# Test database
TEST_MONGODB_DATABASE  # El nombre de la base de datos de test
TEST_MONGODB_URI       # La URI de la base de datos de test

# SSL 
HTTPS_CERT             # Ruta del certificado SSL, por ejemplo -> my_cert.crt
HTTPS_KEY              # Ruta de la clave del certificado SSL, por ejemplo -> my_cert.key
```

### Bot

Para obtener el `SLACK_TOKEN` y el `SLACK_USER_TOKEN` hay que crear una aplicación de Slack en [api.slack.com/apps](https://api.slack.com/apps)

Una vez creado el bot, deberías estar en la sección **Basic Information** tendrás un desplegable "**Add features and functionality**", entraremos en donde dice **Bot** y te redireccionará a la sección **App Home** donde actualizaremos los scopes dándole al botón en verde "Review Scopes to Add". Vamos al apartado de **Scopes** y añadiremos los siguientes **Bot Token Scopes** en base a los métodos que estamos consumiendo de Slack:

Method   | Bot Scopes
---------|-----------
[`/chat.postMessage`](https://api.slack.com/methods/chat.postMessage) | `chat:write`
[`/conversations.members`](https://api.slack.com/methods/conversations.members) | `channels:read`, `groups:read`, `im:read`, `mpim:read`
[`/conversations.list`](https://api.slack.com/methods/conversations.list) | `channels:read`, `groups:read`, `im:read`, `mpim:read`
[`/users.info`](https://api.slack.com/methods/users.info) | `users:read`
[`/views.open`](https://api.slack.com/methods/views.open) | _No scope required_

Una vez tengamos los _scopes_ actualizados, podremos instalar el bot en nuestro _workspace_, podremos hacerlo al principio de la misma página donde actualizaste los _scopes_. Ya tendrémos disponible el token del bot que debería comenzar por `xoxb`.

Ahora, para poder consumir nuestras funcionalidades nos faltaría crear los **Slash Commands** y el **Interactivity** command. Para ello vamos al apartado de **Slash Commands* en el menú izquierdo donde podremos crear nuestros comandos, rellenaremos todos los campos necesarios con los comandos que tenemos en la [documentación de funcionalidades](https://github.com/lean-mind/leanbot/blob/master/docs/features.md).

Teniendo los **Slash Commands** tendríamos que ir al apartado **Interactivity** para añadir un último endpoint `{URL}/interactive`, donde dice **Request URL**. Éste se utilizará para los comandos con "varios pasos", es decir, que si lanzas un comando y te devuelve un modal o un mensaje interactivo en el que tendrás que introducir información o habrán botones con acciones, irán a tráves del endpoint de **Interactivity**, para diferenciarlos, estamos utilizando el `external_id` para identificar el siguiente paso que deberá hacer.

Si revisas en el apartado **Basic Information** deberías tener los slash commands, los bots y los permisos marcados además de la app instalada en tu workspace de desarrollo. También tendrás el `SLACK_SIGNING_SECRET` que equivale al **Verification Token**

### TheCatAPI

Estamos utilizando [TheCatAPI](https://thecatapi.com) para obtener imágenes aleatorias de gatitos, con ponerlo en producción sería suficiente, si no está el token, devolverá siempre la misma url de una imagen. Creándote una cuenta en [TheCatAPI](https://thecatapi.com) podrás obtener el token.

----------------

## Scripts

Tenemos estos scripts:

```bash
build                 # Genera la carpeta dist
start                 # Arranca la app
start:dev             # Arranca la app y se actualizará al guardar 
test                  # Lanza los tests 
test:silent           # Lanza los tests sin mostrar la salida por consola
test:watch            # Lanza los tests y se relanzarán al guardar
coverage              # Genera el análisis de cubrimiento del código
test:database-windows # Script para Windows que lanza un contenedor docker 
                      # para la base de datos de test
test:database-unix    # Script para UNIX que lanza un contenedor docker 
                      # para la base de datos de test
lint                  # Ejecuta ESLint 
```

Si nunca has utilizado node, se arrancarían utilizando el comando `npm run <script>` siendo script uno de los anteriores mencionados.

----------------

## Trabajo en local

1. Clonar el repositorio
12. Generar un certificado y una clave SSL ([Tutorial](https://programarivm.com/pon-en-marcha-un-servidor-https-en-node-js-con-express))  
2. Configurar el `.env` haciendo una copia de `.env.sample` y actualizando las variables.
3. Instalar los paquetes de node con `npm install`
4. Exponer tu ip local para poder acceder a los comandos desde slack (se recomienda [`ngrok`](https://ngrok.com))

    - Para HTTP: `ngrok http 80`
    - Para HTTPS: `ngrok http https://localhost:80`

5. Actualizar los slash commands y el endpoint de interactive en la aplicación de Slack con la url que te da `ngrok`
6. Levantar la base de datos con docker `docker-compose up database` (no tiene seguridad user-pass)
7. Arrancar la aplicación en watch `npm run start:dev`

----------------

## Despliegue

1. Clonar el repositorio
2. Configurar el `.env.prod`
3. Levantar todo con docker `docker-compose up`
    > :bulb: **IMPORTANTE**: El puerto de MongoDB (por defecto 27017) debe estar protegido mediante un firewall, y **NO SE DEBE EXPONER**.

----------------

## Estructura

- **actions**: Las acciones programadas, los endpoints y la interactividad lanzarán las acciones de esta carpeta
- **models**: Aquí están los Modelos de datos, DTOs e Interfaces
- **scheduler**: Aquí es donde se realizarán las acciones programadas
- **services**
  - **api**: Los slash commands y la interactividad entrarán a través de la API
  - **cat**: El servicio que nos proporciona imágenes de gatos
  - **database**: Es donde se accederá a la base de datos
    - **mongodb**: Es la implementación de la base de datos que estamos utilizando actualmente
  - **file**: Es el servicio que se encargará de escribir en ficheros
  - **i18n**: Proporciona los textos y traducciones de la aplicación
  - **logger**: Aquí están todos los logs para tener un control de lo que va sucediendo en la aplicación
  - **platform**: Aquí están todas las plataformas en las que se utiliza o se podría utilizar el bot
    - **slack**: Es el que conecta con Slack a través de los endpoints
      - **methods**: Aquí estarán todos los métodos que utilizaremos de Slack
      - **props**: Son los métodos para recuperar las propiedades de cada acción
      - **views**: Son objetos que slack reconocerá como vistas
  - **schedule**: Es donde se crearán las fechas o intervalos de las acciones programadas
- **tests**: Aquí están principalmente los builders de los tests que están con sus respectivos servicios

## Authors

Michael Reyes - [@mreysei](https://github.com/mreysei)  
Sara Revilla - [@mizsrb](https://github.com/mizsrb)  
Airán Sánchez - [@AiranSchez](https://github.com/AiranSchez)  
Juan Antonio Quintana - [@JuanAntonioQ](https://github.com/JuanAntonioQ)

----------------

## Recursos

- [Slack API](https://api.slack.com)
  - [Methods](https://api.slack.com/methods)
  - [Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Emojis para Slack](https://emojipedia.org/slack)
- [La guía de emojis para commits que seguimos en Leanbot](https://gitmoji.dev)

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

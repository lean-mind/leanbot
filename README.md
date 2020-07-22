# LeanBot para Slack
Pet proyect de un bot para el Slack de LeanMind 💙

----------------

## Índice

- [Instalación](#instalación)
  - [Bot](#bot)
  - [Firebase](#firebase)
  - [Instalar paquetes](#instalar-paquetes)
- [Scripts](#scripts)
- [Despliegue](#despliegue)
- [Estructura](#estructura)
- [Recursos](#recursos)


### **Docs**

- [Documentos](https://github.com/mreysei/leanbot/tree/master/docs)
- [Funcionalidades](https://github.com/mreysei/leanbot/blob/master/docs/features.md)

----------------

## Instalación

### **Bot**
Necesitas el fichero `.env` en la raiz del proyecto, puedes duplicar el fichero `.env.sample` y modificar los valores:

```
BOT_TOKEN              // Token de la aplicación de Slack (Bot Clasico) empieza por "xoxb"
BOT_NAME               // Nombre que tendrá el Bot por defecto
BOT_DISCONNECT         // El estado del bot, on u off, por defecto false, es decir, conectado
API_PORT               // El puerto por el que se levantará express para los comandos
SLACK_SIGNING_SECRET   // El 'Signing secret' de slack, sin este secret no se ejecutará ningún comando
```

Para obtener el `BOT_TOKEN` hay que crear una aplicación de slack en esta dirección (https://api.slack.com/apps?new_classic_app=1), **por ahora** es completamente necesario que sea un bot clásico, por eso el parámetro `new_classic_app` en la url, porque a día de hoy (Marzo de 2020) las nuevas aplicaciones están dando el error `not_allowed_token_type`, si te da este error es posible que hayas creado una aplicación de las nuevas.

Una vez creado el bot, deberías estar en las sección **Basic Information** tendrás un desplegable "**Add features and functionality**", añadiremos el **Bot**.

Vamos a actualizar los scopes, que basicamente son los permisos. En el Step 1, empezaremos con el permiso de **commands** y luego los todos los del grupo "**Scopes that cover what your app currently has access to through the bot token**", está pendiente mejorar esta parte y sólo seleccionar los permisos correspondientes. En el Step 2 no hace falta ninguno. El Step 3 es una confirmación, pero dado que estamos usando un bot clásico, hay que tener en cuenta que el botón para confirmar y que siga funcionando todo es **No, edit scopes**

Ahora en el menú izquierdo entraremos en **OAuth & Permissions** e instalaremos la app en nuestro workspace. Ya tendrémos disponible el token del bot.

Si revisas en el apartado **Basic Information** deberías tener marcado los bots, los permisos e instalado en tu workspace.

### **Firebase**

Pasemos a Firebase, para empezar necesitas otro fichero, el `service-account-key.json` que estará en la carpeta `./src/config/`, éste es un fichero autogenerado por Firebase para poder conectarnos a la base de datos **Realtime**

Para empezar creamos un nuevo proyecto en la consola de Firebase https://console.firebase.google.com/
Una vez creado, vamos al apartado **Project Overview** en el menú izquierdo.
Añadimos una nueva aplicación web, ignora el script que te dará al crear la aplicación, esto es para el firestore que no vamos a usar por ahora.

Como nosotros vamos a usar una base de datos realtime, vamos a ir a la configuración de la aplicación (en el engranaje al hacer click sobre la aplicación) y vamos al apartado **Cuentas de servicio**, aquí podremos generar el `json` que necesitamos para conectarnos con la base de datos.

Sólo necesitaremos los valores de `private_key`, `project_id` y `client_email`

### **Instalar paquetes**

Como es una aplicación node abrá que instalar los paquetes con un `npm i`

----------------

## Scripts

Tenemos estos scripts:
```
build        // Genera la carpeta build
start        // Arranca la app
start:dev    // Arranca la app y se actualizará al guardar 
test         // Lanza los tests 
test:watch   // Lanza los tests y se relanzarán al guardar 
```

Si nunca has utilizado node, se arrancarían utilizando el comando `npm run <script>` siendo script uno de los anteriores mencionados

----------------

## Despliegue

Temporalmente se está utilizando `pm2` desplegándolo en segundo plano en el servidor
```
pm2 ls                                  // Lista los procesos levantados
pm2 stop <name>                         // Para el proceso especificado en <name>
pm2 delete <name>                       // Elimina el proceso especificado en <name>
pm2 start build/index.js --name <name>  // Arranca el proceso y le da un nombre <name> (importante: antes de levantar hacer un "npm run build")
pm2 logs                                // Lista los últimos 15 logs del bot y se queda a la espera de nuevos logs
```

----------------

## Estructura

- **actions**: Son las acciones que se lanzarán con los eventos del websocket que estará escuchando nuestra aplicación de slack
- **config**: Aquí están las variables de configuración y de entorno
- **endpoints**: Aquí están las funciones y rutas de los endpoints
- **models**: Aquí están los modelos, serán interfaces las que no tengan ninguna lógica, clases las que sí
- **scheduler**: Aquí es donde se realizarán las acciones programadas
- **services**
  - **api**: Los slash commands entrarán a través de la API
  - **bot**: Es el encargado de realizar todas las acciones hacia Slack
  - **database**: Es donde se accederá a la base de datos de forma abstracta
  - **firebase**: Es la base de datos en concreta que consumirá el servicio *database*
  - **logger**: Aquí están todos los logs para tener un control de lo que va sucediendo en la aplicación
  - **schedule**: Es donde se crearán las fechas o intervalos de las acciones programadas
  - **slack**: Es el que conecta con slack, tanto por websocket como por api

----------------

## Recursos
- Slack API: https://api.slack.com/
  - Methods: https://api.slack.com/methods
  - RealTimeMessaging: https://api.slack.com/rtm
- Emojis para Slack (nombres): https://emojipedia.org/slack

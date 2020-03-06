# LeanBot para Slack

## Instalación

### **Bot**
Necesitas el fichero `.env` en la raiz del proyecto, puedes duplicar el fichero `.env.sample` y modificar los valores:

```
BOT_TOKEN      // Token de la aplicación de Slack (Bot Clasico) empieza por "xoxb"
BOT_NAME       // Nombre que tendrá el Bot por defecto
BOT_DISCONNECT // El estado del bot, on u off, por defecto false, es decir, conectado
```

Para obtener el `BOT_TOKEN` hay que crear una aplicación de slack en esta dirección (https://api.slack.com/apps?new_classic_app=1), **por ahora** es completamente necesario que sea un bot clásico, por eso el parámetro `new_classic_app` en la url, porque a día de hoy (Marzo de 2020) las nuevas aplicaciones están dando el error `not_allowed_token_type`, si te da este error es posible que hayas creado una aplicación de las nuevas.

Una vez creado el bot, deberías estar en las sección **Basic Information** tendrás un desplegable "**Add features and functionality**", añadiremos el **Bot**.

Vamos a actualizar los scopes, que basicamente son los permisos. En el Step 1, por ahora, vamos a añadir los del grupo "**Scopes that cover what your app currently has access to through the bot token**", está pendiente mejorar esta parte y sólo seleccionar los permisos correspondientes. En el Step 2 no hace falta ninguno. El Step 3 es una confirmación.

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
build        // Genera la carpeta build, la que se desplegará
start        // Arranca la app, la idea es para producción
start:dev    // Arranca la app en modo desarrollo, que se actualizará al guardar 
```

Si nunca has utilizado node, se arrancarían utilizando el comando `npm run <script>` siendo script uno de los anteriores mencionados

----------------

## Estructura

- **actions**: Son las acciones que se lanzarán con los eventos del websocket que estará escuchando nuestra aplicación de slack
- **config**: Aquí están las variables de configuración y de entorno
- **models**: Aquí están los modelos, serán interfaces las que no tengan ninguna lógica, clases las que sí
- **scheduler**: Aquí es donde se realizarán las acciones programadas
- **services**
  - **bot**: Es el encargado de realizar todas las acciones hacia Slack
  - **database**: Es donde se accederá a la base de datos, en este caso firebase 
  - **schedule**: Es donde se crearán las fechas o intervalos de las acciones programadas
  - **slack**: Es el que conecta con slack, tanto por websocket como por api

----------------

## Recursos
- Slack API: https://api.slack.com/
  - Methods: https://api.slack.com/methods
  - RealTimeMessaging: https://api.slack.com/rtm
- Emojis para Slack (nombres): https://emojipedia.org/slack

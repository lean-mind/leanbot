# Funcionalidades

## Thanks
- Es un Slash Command
- Para utilizarlo se hace escribiendo `/thanks`
- Si se usa, abrirá un modal donde introducirás la información que se pide para agradecer algo a personas y/o canales
- Cuando se envíen los datos, irá al endpoint de `/interactive`
- Se mapeará con el siguiente paso dependiendo del valor de `external_id` que tiene el modal `view-thanks.ts`, en este caso sería `thanks-confirmation`
- Se enviará un mensaje a todas las personas implicadas como confirmación
- Se guardarán los datos en la base de datos

## Thanks summary
- Es una acción programada
- Todos los lunes se enviará un resumen a todas las personas que hayan enviado o recibido un agradecimiento
- En el resumen habrá una imagen de un gato aleatorio (desde TheCatAPI)
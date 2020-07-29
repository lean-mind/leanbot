# Funcionalidades

## Mantenimiento
- El websocket del bot expira aproximadamente cada 10 horas
- Cuando el websocket expira, se emite el evento `close` y el bot automaticamente lo levanta de nuevo

## Ayuda
- Tienes el comando `/leanhelp` para ver todas las actuales funcionalidades de la aplicación (Te lleva a este fichero xd)

## Logs
- Puedes ver los logs en tiempo real conectándote al servidor y utilizando `pm2 logs`
- También puedes ver todos los logs en los ficheros `*.log` que se generan en la raiz del proyecto
- Tienes el comando `/logs` para listar los últimos 10 logs
- El comando `/logs` tiene el parametro opcional `<lines>` donde puedes especificar el número de líneas que quieres ver (máximo 50)

## Puntos de gratitud
Actualmente se pueden dar puntos de gratitud positivos a tus compañeros, donde hay que tener en cuenta los siguentes puntos:
- Tienes un total de 15 puntos semanales
- Todos los lunes a primera hora se restablecen los puntos
- Todos los día 1 de cada mes se registran los puntos que has obtenido ese mes (para posibles métricas en el futuro)
- Para dar puntos de gratitud se menciona al usuario y se añaden tantos `+` como puntos quieras dar tal que así: `@Usuario +++`, le daría *3 puntos de gratitud a Usuario*
- ¡¡No puedes darte puntos a ti mismo!!
- *Por ahora* sólo puedes dar puntos a un usuario **por mensaje**, si quieres darle puntos a dos personas, son dos mensajes
- Puedes ver tus puntos semanales con el comando `/points`

## Random
- Tienes el comando `/random` para elegir a un usuario aleatorio del equipo
- El comando tiene un parametro `<users>` donde puedes especificar el número de usuarios aleatorios que quieres recibir
- Si introduces un número mayor al número de usuarios existentes en Slack, usará el número de usuarios de Slack
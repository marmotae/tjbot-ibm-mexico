# Configurando el proyecto para usar una copia modificada del TJBotLib #
## Introducción ##
Debido a que los APIs utilizados se encuentran en constante evolución, puede ser necesario trabajar con una copia customizada de la biblioteca __tjbot__. Asumiendo que eso sea el caso, podemos modificar nuestra instalación local para hacer uso de una copia modificada que ponemos en una ruta distinta. Aquí documentaremos como apuntar a una ubicación distinta para el __TJBotLib__ pero las instrucciones básicas aplican para cualquier otra biblioteca.

## Modificando la Intalación ##
El projecto cuenta con un archivo llamado __package.json__ mismo que incluye una sección marcada como `dependencies`, mismo que documenta las distintas dependencias de bibliotecas node. A continuación transcribimos dicha sección en su configuración actual.

```
  "dependencies": {
    "assert": "^1.4.1",
    "asyncawait": "^1.0.6",
    "color-model": "^0.2.2",
    "colornames": "^1.1.1",
    "fifo": "^2.3.0",
    "mic": "^2.1.1",
    "node-raspistill": "^0.0.11",
    "object.pick": "^1.2.0",
    "semaphore": "^1.0.5",
    "sleep": "^5.0.0",
    "sound-player": "^1.0.4",
    "temp": "^0.8.3",
    "tjbot": "^1.4.0",
    "watson-developer-cloud": "^2.11.1",
    "winston": "^2.3.1",
    "post-image-to-twitter":"1.0.0",
    "twit":"2.2.9"
  },

```
Para modificar el archivo, basta selecciónar la línea donde aparece nuestra bibioteca __tjbot__ y modificarla para que en lugar de la versión, pongamos la ruta al directorio raiz donde se encuentra el proyecto de código de la biblioteca modificada. Como podemos ver, las rutas pueden ser relativas. Ejemplo:

```
    "tjbot": "../tjbotlib",
```

Una vez modificado el archivo __package.json__, realizamos la instalación de dependencias usando __npm__. 

```
$ npm install 
```
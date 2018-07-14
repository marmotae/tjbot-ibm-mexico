# Receta de proyecto TJBot ajustado para México #

Este es un proyecto en Node.js para demostrar las funcionalidades básicas de TJBot que incluyen: ver, 
escuchar, hablar, bailar, etc.

Para utilizar el presente proyecto en nuestro TJBot, debemos primero clonar este repositorio a nuestro __TJBot__ por lo tanto desde una ventana de terminal en nuestro robót, ejecutaremos la clonación de la siguiente manera:

```
git clone https://github.com/marmotae/tjbot-ibm-mexico.git

```
Esto bajará los archivos de proyecto necesarios restando tan solo bajar las bibliotecas adicionales de las dependencias. Para hacer esto, usamos la herramienta __npm__ de la siguiente forma desde nuestra línea de comando del __TJBot__

```
npm install 
```
El proceso tomará unos minutos en lo que baja el código fuente necesario y lo compila

> Nota: En ocasiones es necesario trabajar con versiones modificadas de las bibliotecas. Esto es una acción para usuarios mas avanzados. Si tienes esta necesidad, puedes ver como hacerlo [aquí](README_LOCAL_LIBRARY.md)

## Configuración de los servicios ##

La configuración de los distintos servicios se hace mediante un archivo de configuración. Se ha integrado un archivo que puede ser usado como punto de partida. Para crearlo, copiemos el archivo muestra a el archivo definitivo de la siguiente forma:

```
cp config.default.js config.js 
```

Existen tres servicios básicos a configurar :
* __Watson Assistant__ que se encargará de administrar el díalogo con el usuario.
* __Speech to Text__ que se encargará de convertir las frases habladas por el usuario en texto.
* y __Text to Speech__ que se encargará de convertir las respuestas en texto generadas por __Watson Assistant__ en voz

Por lo tanto, antes de continuar debemos ir a [IBM Cloud](http://www.bluemix.net) a crear una cuenta y generar los tres servicios.

### Configuración del Watson Assistant ###
El díalogo de nuestro __TJBot__ es controlado y orquestado por el servicio __Watson Assistant__ por lo tanto debemos de configurar el servicio. El primer paso consiste en crear un díalogo, tambien conocido como un __workspace__

Una vez creado el servicio de __Watson Assistant__, debemos entrar a su panel de administración y en la sección __Manage__ damos click sobre el botón para invocar la herramienta de gestión del __Watson Assistant__

![picture Invocando el Administrador del Assistant](resources/images/wa01_administra_assistant.png)

Esto nos lleva a la página de bienvenida para el __Watson Assistant__, una vez ahí debemos seleccionar en el menú superior izquierdo la opción marcada como `Workspaces`para poder crear nuestro espacio de trabajo del díalogo

![picture Seleccionamos la sección de workspaces](resources/images/wa02_administra_workspaces.png)

Una vez que estamos dentro de la sección de `Workspaces`tenemos la opción de crear uno desde cero, sin embargo en nuestro caso, tenemos un archivo previamente creado que importaremos. Para esto debemos hacer click en el botón de importación de archivos

![picture Seleccionamos importar un workspace](resources/images/wa03_elige_importar_workspace.png)

Esto nos mostrará una ventana de dialogo para elegir un archivo mismo que se encuentra entre los archivos clonados de nuestro repositorio. Navegamos a la ruta `resources` y ahí seleccionamos el archivo normbrado `conversacion_taller_tjbot.json` para finalmente importarlo como se muestra a continuación:

![picture Importamos el workspace](resources/images/wa04_elige_archivo_importar_workspace.png)

Al terminar de importar el workspace, se nos transfiere a la pantalla de edición, sin embargo ahora necesitamos regresa a la sección de `Workspaces`para obtener un dato. Por lo tanto en el menú del lado izquerdo seleccionamos el último boton

![picture Regresamos a workspaces](resources/images/wa05_salir_a_paneles.png)

Una vez que nos encontramos en la sección de `Workspaces`debemos tomar la tarjeta correspondiente al taller y dando click en el menú superior derecho, seleccionamos la opción `View details``

![picture Seleccionamos los detalles](resources/images/wa06_propiedades_panel.png)

La tarjeta girará mostrándonos los detalles. Aquí la parte importante es el `Worspace ID`que procedemos a copiar, dando click en el ícono mostrado a continuación

![picture Seleccionamos los detalles](resources/images/wa07_copia_identificador.png)

 Ahora debemos usar ese número en la sección correspondiente de nuestro archivo de configuración `config.js`. Abriendo ese archivo debemos encontrar la siguiente sección

 ```
 /**
 * Creación de los elementos de conversación con el Watson Assistant
 */

// Primero creamos y configuramos el identificador de workspace a usar con Assistant
exports.assistantWorkspaceId = ''; 

 ```
Pegaremos el valor de `WorkspaceId` entre las commilas que aparecen al lado de la frase assistantWorkspaceId.

Ahora procederemos a copiar las credenciales. De regreso en nuestra sección de administración de servicio en __IBM Cloud__ podemos encontrar la sección de credenciales para nuestro servicio. Si esta sección aparece con una serie de `•••••••••••`esto quiere decir que los valores se encuentran ocultos por lo que presionaremos el boton `Show`que aparece en la parte superior derecha. 

![picture Copiando username y password](resources/images/wa08_copia_credenciales.png)

En el caso que aparece anteriormente, este servicio tiene cartas credenciales a manera de username/password. Dependiendo del servicio y de su fecha de creación inicial, es posible que encontremos un servicio en donde en lugar de esto se nos muestre una llave de API como en el caso siguiente

![picture Copiando APIs](resources/images/wa09_copia_api.png)

Ahora deberemos copiar el valor a valores correspondientes para ponerlos en nuestro arvhico de configuracion `config.js` dentro de la variable `exports.credentials.assistant`. Asumiendo que el servicio muestra confirguración mediante username y password, nuestra configuración seguirá la siguiente forma, copiando los valores de username y password de __IBM Cloud__ y pegándolos donde corresponden en el archivo.

```
// Ahora especificamos la credenciales de uso
exports.credentials.assistant = {
	password: '',
	username: ''
};
```

En el caso contraro de que el servicio muestre un APIKey, lo configuraremos de la siguiente manera, copiando el valor de apikey que aparece en la consola de __IBM Cloud__ y pegandolo entre las comillas de la variable `iam_apikey`

```
// Ahora especificamos la credenciales de uso
exports.credentials.assistant = {
	iam_apikey: ''
};
```

### Configuración del Speech to Text ###

En este caso, luego de crear el servicio, debemos entrar en la sección de administración del mismo para copiar sus credenciales y pegar los valores correspondiente en el archivo `config.js` bajo la sección `exports.credentials.speech_to_text` como aparece a continuación, teniendo precaución en elegir ya sea el modo username y password o apikey según sea aplicable

```
/**
 * Creación de las credenciales para el servicio Speech to Text
 * que realiza la conversión de voz a texto
 */
exports.credentials.speech_to_text = {
	password: '',
	username: ''
};
```

### Configuración del Text to Speech ###

En este caso, luego de crear el servicio, debemos entrar en la sección de administración del mismo para copiar sus credenciales y pegar los valores correspondiente en el archivo `config.js` bajo la sección `exports.credentials.text_to_speech` como aparece a continuación, teniendo precaución en elegir ya sea el modo username y password o apikey según sea aplicable

```
/**
 * Creación de las credenciales para el servicio Text to Speech
 * que realiza la conversión de texto a voz
 */
exports.credentials.text_to_speech = {
	password: '',
	username: ''
};
```

# Wave

## tj.armBack()

Causes TJBot to move its arm backward (like a wind-up for a pitch).

> Note: if this method doesn't produce the expected result, the servo motor stop points may need to be overridden. Override the value of `TJBot.prototype._SERVO_ARM_BACK` to find a stop point that satisfies the "back" position. Note that valid servo values are in the range [500, 2300].

## tj.raiseArm()

Causes TJBot to raise its arm to the upward position.

> Note: if this method doesn't produce the expected result, the servo motor stop points may need to be overridden. Override the value of `TJBot.prototype._SERVO_ARM_UP` to find a stop point that satisfies the "back" position. Note that valid servo values are in the range [500, 2300].

## tj.lowerArm()

Causes TJBot to lower its arm to the downward position.

> Note: if this method doesn't produce the expected result, the servo motor stop points may need to be overridden. Override the value of `TJBot.prototype._SERVO_ARM_DOWN` to find a stop point that satisfies the "back" position. Note that valid servo values are in the range [500, 2300].

## tj.wave()

Causes TJBot to wave the arm once (up-down-up).

# Contributing
We encourage you to make enhancements to this library and contribute them back to us via a pull request.

# License
This project uses the [Apache License Version 2.0](LICENSE) software license.

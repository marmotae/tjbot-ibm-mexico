/*
 * Configuración de los parametros generales
 */ 

/** 
 * Configuravion de nivel de bitacoreo soportado por Winston 
 * 
 * Dependiendo del nivel, serán los mensajes desplegados en la consola
 * de acuerdo con la especificación de winston los niveles son:
 * 
 * error
 * warn
 * info
 * verbose
 * debug
 * silly
 * 
*/
exports.loglevel = 'info';

/**
 * Configuración del huso horario:
 * Se necesita configurar un huso horario pues en su defecto los servicios invocados desde
 * el IBM cloud ejecutarán considerando por omisión GMT.
 * 
 * Para consultar una lista completa de los husos revisar en la siguente liga
 * 
 * https://console.bluemix.net/docs/services/conversation/supported-timezones.html#time-zones-supported-by-system-entities
 * 
 */
exports.timezone = 'America/Mexico_City';

/**
 * Creación del objeto de credenciales
 * 
 * Todas las credenciales de los servicios creados serán acumulados dentro de un objeto de crediciales
 */

exports.credentials = {};

/**
 * NOTA IMPORTANTE :
 * Desde junio de 2018, existen dos maneras paralelas para la creación de credenciales para servicios
 * dentro del IBM cloud y cual se debe usar depende directamente de la fecha de creación del servicio
 * 
 * Los servicios antiguos se configuran mediante pares de username y password, mientras que los mas nuevos
 * se configuran mediante el uso de un IAM apikey a manera de ejemplo consideremos un ServicioEjemplo
 * 
 * Si nuestro servicio ejemplo se configura mediante username y password la configuración se verá asi
 * 
 * exports.credentials.ServicioEjemplo = {
 * 		username: '',
 * 		password: ''
 * }
 * 
 * En cambio si nuestro ServicioEjemplo usa un IAM apikey, la configuración se verá asi
 * 
 * exports.credentials.ServicioEjemplo = {
 * 		iam_apikey: ''
 * }
 */


/**
 * Creación de los elementos de conversación con el Watson Assistant
 */

// Primero creamos y configuramos el identificador de workspace a usar con Assistant
exports.assistantWorkspaceId = ''; 

// Ahora especificamos la credenciales de uso
exports.credentials.assistant = {
	password: '',
	username: ''
};

/**
 * Creación de las credenciales para el servicio Speech to Text
 * que realiza la conversión de voz a texto
 */
exports.credentials.speech_to_text = {
	password: '',
	username: ''
};

/**
 * Creación de las credenciales para el servicio Text to Speech
 * que realiza la conversión de texto a voz
 */
exports.credentials.text_to_speech = {
	password: '',
	username: ''
};

/**
 * Otros servicios:
 * 
 * Existen otros servicios que pueden ser utilizados pero que no caen dentro del alcance
 * básico. Se incluyen ejemplos de configuración para efectos ilustrativos. En caso de 
 * usarlos, sólo debemos descomentarlos y llenar los valores de credencial al igual
 * que en los casos anteriores
 */

 /**
  * Servicio de traducción
  */

 /**
exports.credentials.language_translator = {
	iam_apikey: ''
};
 */

/**
 * Servicio de reconocimiento de imágenes
 */

/**
exports.credentials.visual_recognition = {
	api_key: ""
};
 */

/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Cargamos la configuracion de credenciales
var config = require('./config');

//Cargamos la biblioteca de tjbot
var TJBot = require('tjbot');

//creamos una bitácora winston
const winston = require('winston');
winston.level = config.loglevel;


// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.conversationWorkspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['led','servo','microphone', 'speaker','camera'];

// set up TJBot's configuration
var tjConfig = {
    robot: {
    		name: 'mago',
    		gender: 'female',
    },
    listen: {
        language: 'es-ES',
        inactivity_timeout: -1
    },
    speak: {
        language: 'es-ES'
    },
    log: {
        level: config.loglevel,
    },
    see: {
        confidenceThreshold: {
            object: 0.5,   // Lista objetos donde la certeza es > 0.5
            text: 0.5     // Lee textos donde la certeza es > 0.5
        },
        camera: {
            height: 720,
            width: 960,
            verticalFlip: false, // flips the image vertically, may need to set to 'true' if the camera is installed upside-down
            horizontalFlip: false // flips the image horizontally, should not need to be overridden
        },
        language: 'es'
    }
};

// Instanciamos al TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);
winston.debug('TJ Bot Inicializado');


// Nos presentamos en la consola
winston.info("Me puedes pedir que me presente o que te diga un chiste");
winston.info("Intenta decir, \"" + tj.configuration.robot.name + ", por favor preséntate\" o \"¿" + tj.configuration.robot.name + ", Quien eres tu?\"");
winston.info("Tambien podrías decir, \"¡" + tj.configuration.robot.name + ", platícame un chiste!\"");

/**
 * Funcion para leer texto mediante reconocimiento visual
 */
function doRead(){
	winston.verbose('Preparando lectura');
	tj.read().then(function(texts){
		winston.info("Leí : "+texts.images[1].text);
		tj.speak('Esto es lo que leí: '+texts.images[1].text);
	});
}

/**
 * Funcion para traducir a un idoma distinto una frase
 */
function sayIn(mensaje,target,prompt){
	winston.debug("Entrando a función sayIn");
	var original = tj.configuration.speak.language;
	tj.translate(mensaje,original,target).then(function(translation){
		var resultado = translation.translations[0].translation;
		winston.info("Traduciendo \'" + mensaje + "\'")
		winston.verbose("Resultado en " + target + ": " + resultado);
		winston.debug("Cambiando el idioma de la voz de " + original + " a " + target);
		tj.configuration.speak.language = target;
		tj.speak(resultado).then(function(){
			winston.debug("Regresando a idioma original")
			tj.configuration.speak.language = original;
			tj.speak(prompt);
		});
	});
}

/**
 * Función para twitear una imagen captada con el ojo del robot
 */
function doTwitImage(){
	winston.debug("Preparando para twitear imagen");
	// Cargamos la bibliotecas necesarias
	var postImage = require('post-image-to-twitter');
	var Twit = require('twit');
	// Leemos la configuración
	var T = new Twit(config.twitterConfig);
	
	// Tomamos la foto, la leemos de archivo y la publicamos
	winston.debug("Capturando imagen");
	var fs = require('fs');
	tj.takePhoto().then(function(filePath){
	    var buffer = fs.readFileSync(filePath);
	    var postImageOpts = {
	    		twit: T,
	    		base64Image: buffer.toString('base64'),
	    		altText: 'Esto es lo que véo',
	    		caption: 'Vi esto y lo publiqué!'
	    };
	    postImage(postImageOpts, wrapUp);
	    winston.info("Imagen posteada");
	    tj.speak('listo, he hecho una publicación!');
    });
}

function wrapUp(error, data) {
  if (error) {
    winston.error(error, error.stack);

    if (data) {
      winston.error('data:', data);
    }
  }
}


/**
 * Funcion para reconocimiento visual
 */
function doSee(){
	winston.debug("Entrando a doSee")
	var objeto=null;
	var otro =null;
	tj.see().then(function(objects){
		for(i=0;i< objects.length;i++){
			winston.debug(objects[i]);
			if(objects[i].type_hierarchy != null){
				if(objeto==null){
					objeto=objects[i];
				}else{
					if(objects[i].score > objeto.score){
						objeto=objects[i];
					}
				}
			}
			if(otro!=null){
				if(objects[i].score > otro.score){
					otro=objects[i];
				}
			}else{
				otro=objects[i];
			}
		}
		if(objeto != null){
			tj.speak(objeto.class);
		} else if (otro != null){
			tj.speak(otro.class);
		} else {
			tj.speak("No reconozco nada!");
		}
	});
}

/**
 * Funcion discoParty Invocada para que baile el tjBot
 */
function discoParty() {
	winston.debug("Entrando a discoParty");
	tj.speak("¡Claro, mira como bailo!").then(function(){
	var tjColors = tj.shineColors();
	tj.play('./resources/club.wav').then(function(){
		tj.speak("¿Cómo te quedó el ojo?");
	});
	for (i = 0; i < 10; i++) {
		tj.wave();
	}
	});
}

/**
 * Funcion para cantar
 */
function sing(){
	winston.debug("Entrando a sing");
	tj.speak("¡Por supuesto, déjame afinar!").then(function(){
		tj.play('./resources/trololo.wav')
	});
}

/**
 * Funcion para ajustar el huso horario a lo especificado
 * por el archivo de configuración. De no hacerlo, el 
 * default es usar GMT
 */
function ajustaHuso() {
	winston.debug("Entrando a ajustaHuso");
	if(config.timezone != undefined && tj != undefined && tj._assistantContext != undefined){
		winston.debug("Validando la existencia de un assistant Context para el workspace");
		if(tj._assistantContext[WORKSPACEID]==undefined){
			winston.debug("No existe el context por lo que creamos uno");
			tj._assistantContext[WORKSPACEID]={};
		}
		winston.info("Ajustando zona a "+config.timezone);
		tj._assistantContext[WORKSPACEID].timezone=config.timezone;
	}
}

/**
 * Este es el loop principal de el programa en el que escuchamos al usuario
 * y actuamos ya sea de acuerdo al dialogo de assistant o respondemos a las acciones
 * que assistant nos regresa
 */
function doListen(){
	winston.debug("Entrando a do Listen");
	ajustaHuso();
	try{
		tj.listen(function(msg) {
			// Validamos si estan hablando con nosotros
			if (msg.startsWith(tj.configuration.robot.name)) {
				winston.debug("Mencionaron nuestro nombre");

				// Eliminamos nuestro nombre del mensaje
				var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");
				
				// Empujamos el mensaje a conversation
				winston.debug("Invocamos a el assistant");
				tj.converse(WORKSPACEID, turn, function(response) {
					winston.debug("Revisamos si hay respuesta");
					if(response != null){
						winston.debug("Tenemos una respuesta");
						if (response.object != null){
							var salida = response.object.output;
							var contexto = response.object.context;
							if(salida != null){
								if(salida.accion != null && salida.accion != ''){
									winston.info("Detectamos la accion : "+salida.accion);
									if(salida.accion === 'baila'){discoParty()};
									if(salida.accion === 'canta'){sing()};
									if(salida.accion === 'subeBrazo'){
										tj.raiseArm();
									};
									if(salida.accion === 'bajaBrazo'){
										tj.lowerArm();
									};
									if(salida.accion === 'translate'){
										sayIn(contexto.payload,contexto.Idioma,salida.text[0]);
									}
								}else{
									if(salida.text != null && salida.text.length == 1){
										tj.speak(salida.text[0]);
									}
								}
							}else{
								winston.debug("La respuesta no tenía salida alguna!");
							}
						}else{
							winston.debug("La respuesta no contaba con un objeto!");
						}
					}else{
						winston.debug("No obtuvimos una respuesta!");
					}
				});
			}
		});
	}catch(err){
		doListen();
	}
}

doListen();

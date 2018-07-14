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
var WORKSPACEID = config.assistantWorkspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['led','servo','microphone', 'speaker','camera'];

// set up TJBot's configuration
var tjConfig = {
    robot: {
    		name: 'mago',
    		gender: 'male',
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

/*
 * Funcion para leer texto mediante reconocimiento visual
 */
function doRead(){
	winston.verbose('Preparando lectura');
	tj.read().then(function(texts){
		console.log(JSON.stringify(texts));
		winston.info("Leí : "+texts.images[1].text);
		tj.speak('Esto es lo que leí: '+texts.images[1].text);
	});
}

/*
 * Función para twitear una imagen captada con el ojo del robot
 */
function doTwitImage(){
	winston.verbose("Preparando para twitear imagen");
	// Cargamos la bibliotecas necesarias
	var postImage = require('post-image-to-twitter');
	var Twit = require('twit');
	// Leemos la configuración
	var T = new Twit(config.twitterConfig);
	
	// Tomamos la foto, la leemos de archivo y la publicamos
	winston.verbose("Capturando imagen");
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
	    winston.debug("Imagen posteada");
	    tj.speak('listo, he hecho una publicación!');
    });
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
  }
}


// Reconocimiento Visual
function doSee(){
	var objeto=null;
	var otro =null;
	tj.see().then(function(objects){
		for(i=0;i< objects.length;i++){
			console.log(objects[i]);
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

// Baila
function discoParty() {
	var tjColors = tj.shineColors();
	tj.play('./resources/club.wav');
	for (i = 0; i < 10; i++) {
		tj.wave();
	}
}

/*
 * Ajusta la variable de contexto para huso horario
 * si no ajustamos el huso, por default trabaja en GMT
 */
function ajustaHuso() {
	if(config.timezone != undefined && tj != undefined && tj._assistantContext != undefined){
		if(tj._assistantContext[WORKSPACEID]==undefined){
			tj._assistantContext[WORKSPACEID]={};
		}
		winston.info("Ajustando zona a "+config.timezone);
		tj._assistantContext[WORKSPACEID].timezone=config.timezone;
	}
}


/*
 * Escuchamos lo que dice el usuario y lo mandamos al servicio
 * de Watson Assistant
 */
function doListen(){
	ajustaHuso();
	try{
		tj.listen(function(msg) {
			// Validamos si estan hablando con nosotros
			if (msg.startsWith(tj.configuration.robot.name)) {
				
				// Eliminamos nuestro nombre del mensaje
				var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");
				
				// Empujamos el mensaje a Assistant
				tj.converse(WORKSPACEID, turn, function(response) {
					
					// Manejamos la respuesta
					if(response != null && response.description != null && response.description != ''){
						if(response.description.startsWith('<')){
							if(response.description.startsWith('<baila/>')){discoParty();}
							if(response.description.startsWith('<comparte/>')){doTwitImage()};
							if(response.description.startsWith('<ve/>')){doSee()};
							if(response.description.startsWith('<subeBrazo/>')){
								tj.raiseArm();
								tj.speak('brazo arriba!');
							};
							if(response.description.startsWith('<bajaBrazo/>')){
								tj.lowerArm();
								tj.speak('brazo abajo!');
							};
						} else {
							tj.speak(response.description);
						}
					}
				});
			}
		});
	}catch(err){
		doListen();
	}
}

doListen();

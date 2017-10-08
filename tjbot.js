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

// Cargamos la biblioteca de tjbot
var TJBot = require('./lib/tjbot');
// Cargamos la configuracion de credenciales
var config = require('./config');


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
        level: 'verbose',
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


// Nos presentamos en la consola
console.log("Me puedes pedir que me presente o que te diga un chiste");
console.log("Intenta decir, \"" + tj.configuration.robot.name + ", por favor preséntate\" o \"¿" + tj.configuration.robot.name + ", Quien eres tu?\"");
console.log("Tambien podrías decir, \"¡" + tj.configuration.robot.name + ", platícame un chiste!\"");

function isEven(n){
   return n % 2 == 0;
}

// Lee un texto desde la cámara
function doRead(){
	tj.read().then(function(texts){
		console.log(JSON.stringify(texts));
		tj.speak('Esto es lo que leí: '+texts.images[1].text);
	});
}

// Twitea una foto con el ojo
function doTwitImage(){
	// Cargamos la bibliotecas necesarias
	var postImage = require('post-image-to-twitter');
	var Twit = require('twit');
	// Leemos la configuración
	var T = new Twit(config.twitterConfig);
	
	// Tomamos la foto, la leemos de archivo y la publicamos
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
	    tj.speak('listo, he hecho una publicacion!');
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

function discoParty() {
	var tjColors = tj.shineColors();
	tj.play('./resources/club.wav');
	for (i = 0; i < 10; i++) {
		setTimeout(function() {
			var randIdx = Math.floor(Math.random() * tjColors.length);
			var randColor = tjColors[randIdx];
			tj.shine(randColor);
		}, i * 250);
		tj.wave();
	}
}

/*
 * Escuchamos lo que dice el usuario y lo mandamos al servicio
 * de Watson conversation
 */
function doListen(){
	console.log(tj.conversationContext);
	try{
		tj.listen(function(msg) {
			// Validamos si estan hablando con nosotros
			if (msg.startsWith(tj.configuration.robot.name)) {
				
				// Eliminamos nuestro nombre del mensaje
				var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");
				
				// Empujamos el mensaje a conversation
				tj.converse(WORKSPACEID, turn, function(response) {
					
					// Manejamos la respuesta
					if(response != null && response.description != null && response.description != ''){
						if(response.description.startsWith('<')){
							if(response.description.startsWith('<baila/>')){discoParty();}
							if(response.description.startsWith('<comparte/>')){doTwitImage()};
							if(response.description.startsWith('<ve/>')){doSee()};
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

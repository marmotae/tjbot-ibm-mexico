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

const TJBot = require('./lib/tjbot');
const config = require('./config');

var credentials = config.credentials;
var hardware = ['camera','speaker'];

// turn on debug logging to the console
var tjConfig = {
    log: {
        level: 'silly'
    },
    see: {
    	confidenceThreshold: {
            object: 0.2,   // only list image tags with confidence > 0.5
            text: 0.1     // only list text tags with confidence > 0.5
        },
        camera: {
            height: 720,
            width: 960,
            verticalFlip: false, // flips the image vertically, may need to set to 'true' if the camera is installed upside-down
            horizontalFlip: false // flips the image horizontally, should not need to be overridden
        },
        language:'en'
    }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

tj.recognizeTextInPhoto('./resources/image.jpeg').then(function(objects){
	console.log(JSON.stringify(objects, null, 2));
	console.log(objects.images[0].text);
});

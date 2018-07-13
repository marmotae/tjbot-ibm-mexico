/*
 * Configuración de los parametros generales
 */ 

// Configuravion de nivel de bitacoreo
exports.loglevel = 'info';

// Configuración para workspaceId de conversation
exports.conversationWorkspaceId = ''; 

// Huso horario para la conversacion
// Ver en https://console.bluemix.net/docs/services/conversation/supported-timezones.html#time-zones-supported-by-system-entities
exports.timezone = 'America/Mexico_City';

// Create the credentials object for export
exports.credentials = {};

// Watson Conversation
// https://www.ibm.com/watson/developercloud/conversation.html
exports.credentials.conversation = {
	password: '',
	username: ''
};

exports.credentials.language_translator = {
	iam_apikey: ''
};

// Watson Speech to Text
// https://www.ibm.com/watson/developercloud/speech-to-text.html
exports.credentials.speech_to_text = {
	password: '',
	username: ''
};

// Watson Text to Speech
// https://www.ibm.com/watson/developercloud/text-to-speech.html
exports.credentials.text_to_speech = {
	password: '',
	username: ''
};

// Watson Visual Recognition
// https://gateway-a.watsonplatform.net/visual-recognition/api
exports.credentials.visual_recognition = {
	api_key: ""
};

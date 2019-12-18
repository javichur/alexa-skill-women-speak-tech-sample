// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const moment = require('moment');

const helpSpeakOutput = 'Dime algo como "Hola Mundo", "cuéntame una curiosidad", "canta un villancico" o "cuántos días quedan". ¿Qué dices?';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Bienvenido a la skill Hola Mundo. Dime algo como "Hola Mundo".';
    setRepeat(handlerInput, speakOutput); // guardar para poder repetir

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speakOutput = '¡Hola Mundo! <say-as interpret-as="interjection">feliz navidad</say-as>';
    setRepeat(handlerInput, speakOutput); // guardar para poder repetir

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = helpSpeakOutput;
    setRepeat(handlerInput, speakOutput); // guardar para poder repetir

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CuriosidadesNavidadIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CuriosidadesNavidadIntent';
  },
  handle(handlerInput) {

    const curiosidades = [
      'El establecimiento oficial del 25 de diciembre como “día de Navidad” se produce en el año 345, cuando por influencia de San Juan Crisóstomo y San Gregorio Nacianzeno se proclama esta fecha para la Natividad de Cristo',
      'Papá Noel no siempre tuvo barba. Fue el artista y dibujante Thomas Nast quien añadió la barba al personaje durante la última parte del siglo XIX.',
      'La estrella de Navidad que suele coronar nuestros árboles navideños es originaria de Filipinas.',
      'Uno de los arboles de Navidad más famosos por su tamaño, es el que se alza en el Rockefeller Center de Nueva York (Estados Unidos), con alrededor de 24 metros de altura.',
      'Se cree que los alemanes fueron los primeros en traer "árboles de Navidad" a sus hogares durante las vacaciones y decorarlos con galletas y luces.',
    ];

    const speakOutput = 'Una curiosidad de navidad: ' + curiosidades[Math.floor(Math.random() * curiosidades.length)] + ' ' + helpSpeakOutput;
    setRepeat(handlerInput, speakOutput); // guardar para poder repetir

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};


const CantaVillancicoIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CantaVillancicoIntent';
  },
  handle(handlerInput) {

    const audio = '¡Hola Mundo! <audio src="soundbank://soundlibrary/holidays/christmas/christmas_01"/>';

    const speakOutput = audio + ' ' + helpSpeakOutput;
    setRepeat(handlerInput, audio); // guardar para poder repetir

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};


const RepetirIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {

    const speakOutput = getRepeat(handlerInput) + ' ' + helpSpeakOutput;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};


const CuantosDiasQuedanIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CuantosDiasQuedanIntent';
  },
  handle(handlerInput) {

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.tipo;

    let itemNameMatched = 'nada'; // lo que matchea con la respuesta dada por el usuario (navidad, nochevieja, etc...)

    if (itemSlot && itemSlot.resolutions
      && itemSlot.resolutions.resolutionsPerAuthority
      && itemSlot.resolutions.resolutionsPerAuthority[0].values
      && itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name
    ) {
      /* Guardamos la opción elegida por el usuario (navidad, nochevieja, reyes); no lo que ha pronunciado.
           Es decir, sí ha pronunciado "seis de enero" lo que nos guardamos es "reyes".
           Esto lo podemos hacer porque a la hora de crear el modelo, hemos definido "seis de enero" como sinónimo de "reyes".
        */
      itemNameMatched = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else {
      // caso posible si no hay match.
      itemNameMatched = null;
    }

    let speakDias = 'No sé cuántos';
    let fechaPreguntada = null;

    console.log('itemNameMatched = ' + itemNameMatched);

    if (itemNameMatched === 'navidad') {
      fechaPreguntada = '2019-12-25';
    } else if (itemNameMatched === 'nochebuena') {
      fechaPreguntada = '2019-12-24';
    } else if (itemNameMatched === 'nochevieja') {
      fechaPreguntada = '2019-12-31';
    } else if (itemNameMatched === 'reyes') {
      fechaPreguntada = '2020-1-6';
    } else if (itemNameMatched === 'año nuevo') {
      fechaPreguntada = '2020-1-1';
    }

    const end = moment(fechaPreguntada);
    const start = moment(new Date());
    var duration = moment.duration(end.diff(start));
    speakDias = Math.ceil(duration.asDays());

    const speakOutput = speakDias + ' días quedan para ' + itemNameMatched + ', que será ' + fechaPreguntada + '. ' + helpSpeakOutput;
    setRepeat(handlerInput, speakOutput); // guardar para poder repetir

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};


function setRepeat(handlerInput, repeat) {
  const { attributesManager } = handlerInput;
  const sessionAttributes = attributesManager.getSessionAttributes();

  sessionAttributes.repeat = repeat; // save

  attributesManager.setSessionAttributes(sessionAttributes);
}


function getRepeat(handlerInput) {
  const { attributesManager } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes();

  if (sessionAttributes.repeat) {
    return sessionAttributes.repeat;
  }

  return 'No tengo nada que repetir,';
}


const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = '¡Hasta luego!';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    CuriosidadesNavidadIntentHandler,
    CantaVillancicoIntentHandler,
    CuantosDiasQuedanIntentHandler,
    RepetirIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addErrorHandlers(
    ErrorHandler,
  )
  .lambda();

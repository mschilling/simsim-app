const functions = require('firebase-functions');
const GateKeeperApi = require('./helpers/GateKeeperApi');
process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').ApiAiAssistant;
const moment = require('moment');

exports.openGate = functions.https.onRequest((request, response) => {
  const accountSid = functions.config().twilio.sid
  const authToken = functions.config().twilio.token
  const twilioNumber = functions.config().twilio.twilio_number
  const outgoingNumber = functions.config().twilio.gate_number
  const environment = functions.config().twilio.environment

  const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
  api.openGate(outgoingNumber, (environment == 'sandbox'))
    .then(() => response.send(":eyes:"))
    .catch((err) => {
      console.log(err);
      response.send('Error: ' + err);
    });
});

exports.assistantWebhook = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  //get the parameter from the response
  let Code = request.body.result.parameters['Emotes']; // Emotes is a required parameter(so will never be empty)
  let passCode = request.body.result.parameters['password']; // passCode is a required parameter(so will never be empty)
  const code = moment().utcOffset('+02:00').format('HHmm');
  console.log(`${code}/${passCode}`);
  let textAnswer = `whoops, looks like something went wrong`; //default on screen answer
  let speechAnswer = `whoops, looks like something went wrong`; //default spoken answer

  if (Code == "succes" || passCode == code) {
    textAnswer = `Alright, I'm opening the gate!`;
    speechAnswer = `Alright. I'm opening the gate`;
    openGate().then(() => {
      response.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
      response.send(JSON.stringify({ "speech": speechAnswer, "displayText": textAnswer }));
    });
  } else {
    textAnswer = `Looks like your code didn't work. Please try again`;
    speechAnswer = `Looks like your code didn't work. Please try again`;

    response.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    response.send(JSON.stringify({ "speech": speechAnswer, "displayText": textAnswer }));
  }

});

function openGate() {
  const accountSid = functions.config().twilio.sid
  const authToken = functions.config().twilio.token
  const twilioNumber = functions.config().twilio.twilio_number
  const outgoingNumber = functions.config().twilio.gate_number
  const environment = functions.config().twilio.environment

  const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
  return api.openGate(outgoingNumber, (environment == 'sandbox'))

}

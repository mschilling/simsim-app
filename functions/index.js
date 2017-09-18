const functions = require('firebase-functions');
const GateKeeperApi = require('./helpers/GateKeeperApi');

process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').ApiAiAssistant;

const moment = require('moment');

exports.assistantWebhook = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({request: request, response: response});

  //get the parameter from the response
  let passCode = request.body.result.parameters['password']; // passCode is a required parameter(so will never be empty)
  
  const code = moment().utcOffset('+02:00').format('HHmm');
  console.log(`${code}/${passCode}`);

  if (passCode == code) {
    openGate().then(() => {
      assistant.setContext("succes");
      let speech = `<speak> Alright, I'm opening the gate!. </speak>`;
      assistant.tell(speech);
      });
    } else {
      assistant.setContext("failure"); 
      let speech = `<speak> Looks like your code didn't work. <break time="1"/> Please try again. </speak>`;
      assistant.ask(speech, ['Please provide the 4 digit code']);
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

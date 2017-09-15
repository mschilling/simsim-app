const functions = require('firebase-functions');
const GateKeeperApi = require('./helpers/GateKeeperApi');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.openGate = functions.https.onRequest((request, response) => {
  const accountSid = functions.config().twilio.sid
  const authToken  = functions.config().twilio.token
  const twilioNumber  = functions.config().twilio.twilio_number
  const outgoingNumber = functions.config().twilio.gate_number
  const environment = functions.config().twilio.environment

  const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
  api.openGate(outgoingNumber, (environment == 'sandbox'))
    .then( () => response.send(":eyes:"))
    .catch( (err) => {
      console.log(err);
      response.send('Error: ' + err);
    });
 });

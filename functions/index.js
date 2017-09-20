const functions = require('firebase-functions');
const GateKeeperApi = require('./helpers/GateKeeperApi');

process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').ApiAiAssistant;
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const ref = admin.database().ref('codes');
const userRef = admin.database().ref('session');

const moment = require('moment');

exports.assistantWebhook = functions.https.onRequest((request, response) => {
  //console.log('headers: ' + JSON.stringify(request.headers));
  //console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({ request: request, response: response });

  //
  const userId = assistant.getUser().userId;
  console.log(assistant.getUser() ,userId);
  //use this code to reset the uid field in the database if it no longer matches.
  //you should uncomment this line again when the right uid is in the database or it will change the database entry with every new device login.
  //return userRef.set({uid: userId});  
  
  //get the parameter from the response
  let passCode = request.body.result.parameters['password']; // passCode is a required parameter(so will never be empty)
  console.log(passCode);
  //check: 0=false, 1=true, 2=true+debug
  let check = 0;
  //loop through the codes in the database and compare them with the user input.
  ref.once('value', ((data) => {
    userRef.once('value', ((userData) => {
      if(userData.val().uid != userId){
        console.log("unmatched ", userData.val().uid, userId);
    data.forEach((childData) => {
      let key = childData.key;
      let debug = childData.val().debug;
      if (passCode == key) {
        if (debug == true) {
          check = 2;
        } else {
          check = 1;
        }
      }
    });
  }else if(userData.val().uid == userId){
    check = 2;
    console.log("match");
  }
  if (check == 0) {
      let speech = `<speak> Looks like that didn't work. <break time="1"/> Did you use the right code? </speak>`;
      assistant.ask(speech, ['Please provide the 4 digit code']);
    } else if (check == 1) {
      openGate().then(() => {
        let speech = `<speak> Alright, I'm opening the gate!. </speak>`;
        assistant.tell(speech);
      });
    } else if (check == 2) {
      let speech = `<speak> Alright, I'm opening the gate, but not for real. </speak>`;
      assistant.tell(speech);
    }
  }));
    
}));
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

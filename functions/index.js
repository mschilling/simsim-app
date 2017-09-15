const functions = require('firebase-functions');
process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').ApiAiAssistant;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.openGate = functions.https.onRequest((request, response) => {
  response.send(":eyes:");
 });

 exports.assistantWebhook = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  let answer = "This is a sample response from your webhook!" 
  
  response.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  response.send(JSON.stringify({ "speech": answer, "displayText": answer 
  }));
 });
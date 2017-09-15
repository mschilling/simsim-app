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

  //get the parameter from the response
  let Code = request.body.result.parameters['Emotes']; // Emotes is a required parameter(so will never be empty)

  let textAnswer = `whoops, looks like something went wrong`; //default on screen answer
  let speechAnswer = `whoops, looks like something went wrong`; //default spoken answer

  if(Code == "succes"){
    textAnswer = `Alright, I'm opening the gate!`;
    speechAnswer = `Alright. I'm opening the gate`;
    //do something
  }else{
    textAnswer = `Looks like your code didn't work. Please try again`;
    speechAnswer = `Looks like your code didn't work. Please try again`;
  }
  
  response.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  response.send(JSON.stringify({ "speech": speechAnswer, "displayText": textAnswer }));
 });
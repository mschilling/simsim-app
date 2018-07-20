import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { welcome } from './welcome-intent';
import { location } from './location-intent';

// process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').DialogflowApp;
admin.initializeApp(functions.config().firebase);

exports.assistantWebhook = functions.https.onRequest((request, response) => {
  const assistant = new Assistant({ request: request, response: response });
  const actionMap = new Map();
  actionMap.set('input.welcome', welcome);
  actionMap.set('input.location', location);
  assistant.handleRequest(actionMap);
});

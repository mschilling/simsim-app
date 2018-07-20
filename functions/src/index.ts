import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import { dialogflow } from 'actions-on-google';
import { welcome } from './welcome-intent';
import { location } from './location-intent';
import { slackWebhookHandler } from './slack-webhook-handler';

const app = dialogflow({
  debug: true,
  init: () => ({
    data: {
      fallbackCount: 0,
      noInputCount: 0,
      noInputResponses: [],
      fallbackResponses: [],
      currentItems: [],
      nextItems: [],
      sessionType: null,
      sessionShown: null,
      sessionsTag: null,
      tagId: null,
    },
  }),
});

app.intent('open_gate', welcome);
app.intent('actions.intent.PERMISSION', location);

export const assistantWebhook = functions.https.onRequest(app);

// Handle Slack webhooks
export const slackWebhook = functions.https.onRequest(slackWebhookHandler);

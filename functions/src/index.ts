import * as i18n from 'i18n';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import { dialogflow } from 'actions-on-google';
import { welcome } from './welcome-intent';
import { location } from './location-intent';
import { slackWebhookHandler } from './slack-webhook-handler';

const moment = require('moment');

i18n.configure({
  locales: ['en-US', 'nl-NL'],
  directory: __dirname + '/locales',
  defaultLocale: 'en-US',
});

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

app.middleware(conv => {
  if (conv.user) {
    i18n.setLocale(conv.user.locale);
    moment.locale(conv.user.locale);
  }
});

app.intent('open_gate', welcome);
app.intent('actions.intent.PERMISSION', location);

export const assistantWebhook = functions.https.onRequest(app);

// Handle Slack webhooks
export const slackWebhook = functions.https.onRequest(slackWebhookHandler);

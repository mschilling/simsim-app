import * as functions from 'firebase-functions';
import * as express from 'express';
import { openGate } from './helpers/open-gate';

const app = express();

app.use('/open', authHandler, async (req, res) => {
  try {
    await openGate();
    res.json({
      text: 'Okay, de slagboom wordt voor je opengegooid ' + randomEmoji(),
    });
  } catch (e) {
    res.json({
      text: 'Oops, dat ging niet helemaal goed :sad_pepe:',
    });
    console.log(e);
  }
});

function randomEmoji() {
  const emojis = [
    ':rabo-algemeen-ik-ga-starten:',
    ':thumbsup:',
    ':tada:',
    ':magic:',
    ':shia:',
  ];
  const index = Math.ceil(Math.random() * emojis.length) - 1;
  return emojis[index];
}

function authHandler(req, res, next) {
  if (req.method !== 'POST') {
    res.send(`Method ${req.method} is not supported`);
    return;
  }

  const slackToken = functions.config().slack.token;
  if (req.body.token !== slackToken) {
    console.log(`Unauthorized token ${req.body.token}`);
    res.send(
      'Helaas, de Slack token is niet meer geautoriseerd. Jij kan hier niks aan doen ;-)'
    );
    return;
  }
  next();
}

export { app as slackWebhookHandler };

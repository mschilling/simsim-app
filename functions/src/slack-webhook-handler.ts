import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();

app.use('/open', authHandler, async (req, res) => {
  res.json({
    text: 'Okay, de slagboom wordt voor je opengegooid!'
  });
});

function authHandler(req, res, next) {
  if (req.method !== 'POST') {
    res.send(`Method ${req.method} is not supported`);
    return;
  }

  const slackToken = functions.config().slack.token;
  if (req.body.token !== slackToken) {
    console.log(`Unauthorized token ${req.body.token}`)
    res.send('Helaas, de Slack token is niet meer geautoriseerd. Jij kan hier niks aan doen ;-)');
    return;
  }
  next();
}

export { app as slackWebhookHandler };

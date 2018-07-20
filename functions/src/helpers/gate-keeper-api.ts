import * as twilio from 'twilio';

export class GateKeeperApi {
  client: twilio.RestClient;

  constructor(private accountSid, private authToken, private twilioNumber) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.twilioNumber = twilioNumber;
    this.client = twilio(this.accountSid, this.authToken);
  }

  openGate(outgoingNumber, mock = false) {
    console.log(
      `openGate(${this.twilioNumber}, ${outgoingNumber}, mock=${mock})`
    );

    if (mock) {
      console.log('mock open gate!');
      return Promise.resolve(true);
    }

    const voiceUrl = 'https://api.michaelschilling.com/voice/default-message';

    return this.client.calls.create(
      {
        url: voiceUrl,
        to: outgoingNumber,
        from: this.twilioNumber,
        method: 'GET',
        fallbackMethod: 'GET',
        statusCallbackMethod: 'GET',
        record: false,
        timeout: 5,
      },
      function(err, message) {
        if (err) {
          console.log(err, message.sid);
        }
      }
    );
  }
}

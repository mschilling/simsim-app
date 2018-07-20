import * as functions from 'firebase-functions';
import { GateKeeperApi } from './gate-keeper-api';

export function openGate() {
  const accountSid = functions.config().twilio.sid;
  const authToken = functions.config().twilio.token;
  const twilioNumber = functions.config().twilio.twilio_number;
  const outgoingNumber = functions.config().twilio.gate_number;
  const environment = functions.config().twilio.environment;

  const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
  return api.openGate(outgoingNumber, environment === 'sandbox');
}

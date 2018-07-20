import * as functions from 'firebase-functions';
import { GateKeeperApi } from './gate-keeper-api';
import { isSandbox } from './settings';

export async function openGate() {
  const accountSid = functions.config().twilio.sid;
  const authToken = functions.config().twilio.token;
  const twilioNumber = functions.config().twilio.twilio_number;
  const outgoingNumber = functions.config().twilio.gate_number;

  const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
  return api.openGate(outgoingNumber, await isSandbox());
}

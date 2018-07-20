import * as admin from 'firebase-admin';
import { openGate } from './helpers/open-gate';

export async function welcome(assistant) {
  console.log('Handle welcome intent');
  const userId = (assistant.getUser() || {}).userId;
  console.log('userId=' + userId);

  const bUserIsWhitelisted = await isUserWhitelisted(userId);

  if (bUserIsWhitelisted) {
    openGate().then(() => {
      const speech = `<speak> Alright, I'm opening the gate! </speak>`;
      assistant.tell(speech);
    });
  } else {
    //not banned or whitelisted, ask for location permission
    const namePermission = assistant.SupportedPermissions.NAME;
    const preciseLocationPermission =
      assistant.SupportedPermissions.DEVICE_PRECISE_LOCATION;
    assistant.askForPermissions('To open the gate', [
      namePermission,
      preciseLocationPermission,
    ]);
  }
}

async function isUserWhitelisted(userId: string): Promise<boolean> {
  const ref = `session/whitelist/${userId}`;
  console.log('Checking isUserWhitelisted for ref ' + ref);
  const snapshot = await admin
    .database()
    .ref(ref)
    .once('value');

  console.log('isUserWhitelisted', snapshot.exists());

  return snapshot.exists();
}

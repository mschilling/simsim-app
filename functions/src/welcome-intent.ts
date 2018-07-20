import * as admin from 'firebase-admin';
import { openGate } from './helpers/open-gate';
import { Permission } from 'actions-on-google';

export async function welcome(conv) {
  console.log('Handle welcome intent');
  let userId = '';
  if (conv.user) {
    userId = conv.user.id;
  }
  console.log('userId=' + userId);

  const bUserIsWhitelisted = await isUserWhitelisted(userId);

  if (bUserIsWhitelisted) {
    try {
      await openGate();
      const speech = `<speak> Alright, I'm opening the gate!</speak>`;
      conv.close(speech);
    } catch (e) {
      conv.close(`<speak>Sorry, something went wrong. Try again soon.</speak>`);
      console.log(e);
    }
  } else {
    // Choose one or more supported permissions to request:
    // NAME, DEVICE_PRECISE_LOCATION, DEVICE_COARSE_LOCATION
    const options: any = {
      context: 'To open the Gate',
      // Ask for more than one permission. User can authorize all or none.
      permissions: ['NAME', 'DEVICE_PRECISE_LOCATION'],
    };
    conv.ask(new Permission(options));
  }
}

async function isUserWhitelisted(userId: string): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const ref = `session/whitelist/${userId}`;
  console.log('Checking isUserWhitelisted for ref ' + ref);
  const snapshot = await admin
    .database()
    .ref(ref)
    .once('value');

  console.log('isUserWhitelisted', snapshot.exists());

  return snapshot.exists();
}

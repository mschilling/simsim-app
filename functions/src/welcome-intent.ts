import * as i18n from 'i18n';
import * as admin from 'firebase-admin';
import { openGate } from './helpers/open-gate';
import { Permission, SimpleResponse } from 'actions-on-google';

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
      conv.close(
        new SimpleResponse({
          text: i18n.__('open_gate_success'),
          speech: i18n.__('open_gate_success_ssml'),
        })
      );
    } catch (e) {
      conv.close(
        new SimpleResponse({
          text: i18n.__('open_gate_error'),
          speech: i18n.__('open_gate_error'),
        })
      );
      console.log(e);
    }
  } else {
    // Choose one or more supported permissions to request:
    // NAME, DEVICE_PRECISE_LOCATION, DEVICE_COARSE_LOCATION
    const options: any = {
      context: i18n.__('request_permission_text'),
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

  return snapshot.exists();
}

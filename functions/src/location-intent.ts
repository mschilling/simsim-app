import * as admin from 'firebase-admin';

import { getDistanceFromLatLonInKm } from './helpers/utils';
import { openGate } from './helpers/open-gate';

export async function location(conv, params, confirmationGranted) {
  console.log('Handle location intent');
  let userId = '';
  if (conv.user) {
    console.log(conv.user, conv.device, conv.location);
    userId = conv.user.id;
  }
  if (!confirmationGranted) {
    conv.close('Sorry, you do not have permission to open the gate');
    return;
  }

  const { latitude, longitude } = conv.device.location.coordinates;
  console.log(latitude + ',' + longitude);

  const displayName = conv.user.name.display;
  console.log(displayName);

  const userIsClose = isNearGate(latitude, longitude);

  if (!userIsClose) {
    await logResult(false, userId, displayName, latitude, longitude);
    conv.close('You do not have permission to open the gate');
    return;
  }

  //logs all attempts succesfull or not
  //the userId represents the google account/assistantID
  try {
    await logResult(true, userId, displayName, latitude, longitude);
    await openGate();
    conv.close(`<speak> Alright, I'm opening the gate! </speak>`);
  } catch (e) {
    conv.close(
      `<speak>Sorry, something went wrong. Please try again later.</speak>`
    );
    console.log(e);
  }
}

function isNearGate(latitude, longitude): boolean {
  const distance = getDistanceFromLatLonInKm(
    latitude,
    longitude,
    52.508338,
    6.0902274
  );

  //check if the user is within 1km of Move4Mobile in Zwolle
  return distance < 1;
}

async function logResult(success, userId, displayName, lat, lng) {
  let ref;
  if (success) {
    ref = 'log/success/' + displayName + userId + '/' + Date.now().toString();
  } else {
    ref = 'log/fail/' + displayName + userId + '/' + Date.now().toString();
  }

  return admin
    .database()
    .ref(ref)
    .set({
      user: displayName,
      userId: userId,
      lat: lat,
      long: lng,
    });
}

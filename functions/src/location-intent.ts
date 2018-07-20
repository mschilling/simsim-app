import * as admin from 'firebase-admin';

import { getDistanceFromLatLonInKm } from './helpers/utils';
import { openGate } from './helpers/open-gate';

export function location(conv, params, confirmationGranted) {
  console.log('Handle location intent');
  let speech;
  let userId = '';
  if (conv.user) {
    console.log(conv.user, conv.device, conv.location);
    userId = conv.user.id;
  }
  if (confirmationGranted) {
    const deviceCoordinates = conv.device.location.coordinates;
    const displayName = conv.user.name.display;
    console.log(displayName);
    console.log(deviceCoordinates.latitude + ',' + deviceCoordinates.longitude);

    const distance = getDistanceFromLatLonInKm(
      deviceCoordinates.latitude,
      deviceCoordinates.longitude,
      52.508338,
      6.0902274
    );

    //check if the user is within 1km of Move4Mobile in Zwolle
    //logs all attempts succesfull or not
    //the userId represents the google account/assistantID
    if (distance < 1) {
      admin
        .database()
        .ref(
          'log/success/' + displayName + userId + '/' + Date.now().toString()
        )
        .set({
          user: displayName,
          userId: userId,
          lat: deviceCoordinates.latitude,
          long: deviceCoordinates.longitude,
        });
      openGate().then(() => {
        speech = `<speak> Alright, I'm opening the gate! </speak>`;
        conv.close(speech);
      });
    } else {
      admin
        .database()
        .ref('log/fail/' + displayName + userId + '/' + Date.now().toString())
        .set({
          user: displayName,
          userId: userId,
          lat: deviceCoordinates.latitude,
          long: deviceCoordinates.longitude,
        });
      speech = 'You do not have permission to open the gate';
      conv.close(speech);
    }
  } else {
    speech = 'Sorry, you do not have permission to open the gate';
    conv.tell(speech);
  }
}

import * as admin from 'firebase-admin';

import { getDistanceFromLatLonInKm } from './helpers/utils';
import { openGate } from './helpers/open-gate';

export function location(assistant) {
  let speech;
  let userId = '';
  if (assistant.getUser()) {
    userId = assistant.getUser().userId;
  }
  if (assistant.isPermissionGranted()) {
    const deviceCoordinates = assistant.getDeviceLocation().coordinates;
    const displayName = assistant.getUserName().displayName;
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
        assistant.tell(speech);
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
      assistant.tell(speech);
    }
  } else {
    speech = 'Sorry, you do not have permission to open the gate';
    assistant.tell(speech);
  }
}

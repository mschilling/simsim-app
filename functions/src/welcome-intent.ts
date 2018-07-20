import * as admin from 'firebase-admin';
import { openGate } from './helpers/open-gate';

export function welcome(assistant) {
  const userId = (assistant.getUser() || {}).userId;
  let check = 0;
  admin
    .database()
    .ref('session/whitelist')
    .once('value', userData => {
      admin
        .database()
        .ref('session/blacklist')
        .once('value', blacklistData => {
          //check for users who can always open the gate
          let whitelistCheck = 0;
            userData.forEach(childData => {
            if (childData.val() === userId) {
              check = 1;
            }
            whitelistCheck++;
            return true;
          });

          //check for users who can never open the gate
          let blacklistCheck = 0;
          blacklistData.forEach(childData => {
            if (childData.val() === userId) {
              check = 2;
              console.log('banned');
            }
            blacklistCheck++;
            return true;
          });

          console.log(whitelistCheck, blacklistCheck);

          if (check === 2) {
            const speech = `<speak> You are no longer allowed to use this feature! </speak>`;
            assistant.tell(speech);
          } else if (check === 1) {
            openGate().then(() => {
              const speech = `<speak> Alright, I'm opening the gate! </speak>`;
              assistant.tell(speech);
            });
          } else if (check === 0) {
            //not banned or whitelisted, ask for location permission
            const namePermission = assistant.SupportedPermissions.NAME;
            const preciseLocationPermission =
              assistant.SupportedPermissions.DEVICE_PRECISE_LOCATION;
            assistant.askForPermissions('To open the gate', [
              namePermission,
              preciseLocationPermission,
            ]);
          } else {
            console.log('Something went wrong...');
          }
        });
    });
}

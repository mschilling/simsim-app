import * as functions from 'firebase-functions';

const GateKeeperApi = require('./helpers/GateKeeperApi');

process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').DialogflowApp;
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.assistantWebhook = functions.https.onRequest((request, response) => {
  const assistant = new Assistant({ request: request, response: response });
  const actionMap = new Map();
  actionMap.set('input.welcome', welcome);
  actionMap.set('input.location', location);
  assistant.handleRequest(actionMap);
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function openGate() {
  const accountSid = functions.config().twilio.sid;
  const authToken = functions.config().twilio.token;
  const twilioNumber = functions.config().twilio.twilio_number;
  const outgoingNumber = functions.config().twilio.gate_number;
  const environment = functions.config().twilio.environment;

  const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
  return api.openGate(outgoingNumber, environment === 'sandbox');
}

function location(assistant) {
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

function welcome(assistant) {
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
          });

          //check for users who can never open the gate
          let blacklistCheck = 0;
          blacklistData.forEach(childData => {
            if (childData.val() === userId) {
              check = 2;
              console.log('banned');
            }
            blacklistCheck++;
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

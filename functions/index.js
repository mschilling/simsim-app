const functions = require('firebase-functions');
const GateKeeperApi = require('./helpers/GateKeeperApi');

process.env.DEBUG = 'actions-on-google:*';
const Assistant = require('actions-on-google').DialogflowApp;
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const ref = admin.database().ref('codes');
const userRef = admin.database().ref('session');

const moment = require('moment');

exports.assistantWebhook = functions.https.onRequest((request, response) => {
  //console.log('headers: ' + JSON.stringify(request.headers));
  //console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({ request: request, response: response });

  //actionmap to handle the incoming requests. The name inbetween the quotes matches the action name in api.ai
  let actionMap = new Map();
  actionMap.set('input.welcome', welcome);
  //actionMap.set('input.open', open);
  actionMap.set('input.location', location);
  assistant.handleRequest(actionMap);

  function location(assistant) {
    let speech;
    const userId = assistant.getUser().userId;
    if (assistant.isPermissionGranted()) {
      let deviceCoordinates = assistant.getDeviceLocation().coordinates;
      let displayName = assistant.getUserName().displayName;
      console.log(displayName);
      console.log(deviceCoordinates.latitude + "," + deviceCoordinates.longitude);

      let distance = getDistanceFromLatLonInKm(deviceCoordinates.latitude, deviceCoordinates.longitude, 52.508338, 6.0902274);

      //check if the user is within 1km of Move4Mobile in Zwolle
      //logs all attempts succesfull or not
      //the userId represents the google account/assistantID
      if (distance < 1) {
        admin.database().ref('log/success/' + displayName + userId + '/' + Date.now().toString()).set({
          user: displayName,
          userId: userId,
          lat: deviceCoordinates.latitude,
          long: deviceCoordinates.longitude
        });
        openGate().then(() => {
          speech = `<speak> Alright, I'm opening the gate! </speak>`;
          assistant.tell(speech);
        })
      } else {
        admin.database().ref('log/fail/' + displayName + userId + '/' + Date.now().toString()).set({
          user: displayName,
          userId: userId,
          lat: deviceCoordinates.latitude,
          long: deviceCoordinates.longitude
        });
        speech = "You do not have permission to open the gate";
        assistant.tell(speech);
      }
    }
  }

  function welcome(assistant) {
    const userId = assistant.getUser().userId;
    let check = 0;
    admin.database().ref('session/whitelist').once('value', ((userData) => {
      admin.database().ref('session/blacklist').once('value', ((blacklistData) => {

        //check for users who can always open the gate
        let whitelistCheck = 0;
        userData.forEach((childData) => {
          if (childData.val() == userId) {
            check = 1;
            console.log("match");
          }
          whitelistCheck++;
        })

        //check for users who can never open the gate
        let blacklistCheck = 0;
        blacklistData.forEach((childData) => {
          if (childData.val() == userId) {
            check = 2;
            console.log("banned");
          }
          blacklistCheck++;
        })

        if (check == 2) {
          let speech = `<speak> You are no longer allowed to use this feature! </speak>`;
          assistant.tell(speech);
        } else if (check == 1) {
          openGate().then(() => {
            let speech = `<speak> Alright, I'm opening the gate! </speak>`;
            assistant.tell(speech);
          });
        } else if (check == 0) {
          //not banned or whitelisted, ask for location permission
          let namePermission = assistant.SupportedPermissions.NAME;
          let preciseLocationPermission = assistant.SupportedPermissions.DEVICE_PRECISE_LOCATION
          assistant.askForPermissions('To open the gate',
            [namePermission, preciseLocationPermission]);
        } else {
          console.log("Something went wrong...");
        }
      }))
    }))
  }

  // function open(assistant) {
  //   const userId = assistant.getUser().userId;
  //   console.log(assistant.getUser(), userId);
  //   //use this code to reset the uid field in the database if it no longer matches.
  //   //you should uncomment this line again when the right uid is in the database or it will change the database entry with every new device login.
  //   //return admin.database().ref('session').set({uid2: userId});  

  //   //get the parameter from the response
  //   let passCode = request.body.result.parameters['password']; // passCode is a required parameter(so will never be empty)
  //   console.log(passCode);
  //   //check: 0=false, 1=true, 2=true+debug
  //   let check = 0;
  //   //loop through the codes in the database and compare them with the user input or skip the code and open directly if the user is in the database.
  //   ref.once('value', ((data) => {
  //     userRef.once('value', ((userData) => {
  //       userData.forEach((childData) => {
  //         if (childData.val().uid == userId) {
  //           check = 1;
  //           console.log("match");
  //         } else {
  //           console.log("unmatched ", userData.val().uid, userId);
  //           data.forEach((childData) => {
  //             let key = childData.key;
  //             let debug = childData.val().debug;
  //             if (passCode == key) {
  //               if (debug == true) {
  //                 check = 2;
  //               } else {
  //                 check = 1;
  //               }
  //             }
  //           });
  //         }
  //       })
  //       if (check == 0) {
  //         let speech = `<speak> I'll need the right code to open the gate. <break time="1"/> Do you know it? </speak>`;
  //         assistant.ask(speech, ['Please provide the 4 digit code']);
  //       } else if (check == 1) {
  //         //openGate().then(() => {
  //         let speech = `<speak> Alright, I'm opening the gate!. </speak>`;
  //         assistant.tell(speech);
  //         //});
  //       } else if (check == 2) {
  //         let speech = `<speak> Alright, I'm opening the gate, but in debug mode. </speak>`;
  //         assistant.tell(speech);
  //       }
  //     }));

  //   }));

  // }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  function openGate() {
    const accountSid = functions.config().twilio.sid
    const authToken = functions.config().twilio.token
    const twilioNumber = functions.config().twilio.twilio_number
    const outgoingNumber = functions.config().twilio.gate_number
    const environment = functions.config().twilio.environment

    const api = new GateKeeperApi(accountSid, authToken, twilioNumber);
    return api.openGate(outgoingNumber, (environment == 'sandbox'))

  }

});



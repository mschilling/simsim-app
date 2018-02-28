const GateKeeperApi = require('../helpers/GateKeeperApi');
const api = new GateKeeperApi('AC650c95bcac59b26d8f18985fd8e83d03', '1f2f940e801bdb9b0ee7e2c8504adbd6', '+31858884189')

api.openGate('+31620346899')
  .then( () => console.log('ready'))
  .catch( (err) => console.log(err));


// const moment = require('moment');

// console.log(moment().format('HHmm'))

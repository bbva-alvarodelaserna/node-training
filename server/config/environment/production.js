'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env._IP ||
    'localhost',

  // Server port
  port: process.env._PORT ||
    8080,

  mongoSettings   : {
    'url': 'mongodb://' + process.env._MONGO_IP + ':' + process.env._MONGO_PORT + '/' + process.env._DDBB_NAME,
    'settings': {
      'db': {
        'native_parser': false
      }
    }
  },
  secretKey       : 'node-trainingApiSecretKey',
  salt            : 'node-trainings4ltv4lu3',
  loggerLevel     : process.env._LOGLEVEL || 'debug'
};

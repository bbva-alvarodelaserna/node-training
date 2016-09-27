'use strict';

// Development specific configuration
// ==================================
module.exports = {
  ip              : 'localhost',
  port            : 9000,
  ddbbPort        : 27017,
  ddbbName        : 'node-training',
  secretKey       : 'node-trainingApiSecretKey',
  salt            : 'node-trainings4ltv4lu3',

  mongoSettings   : {
      'url': 'mongodb://localhost:27017/node-training',
      'settings': {
          'db': {
              'native_parser': false
          }
      }
  }
};

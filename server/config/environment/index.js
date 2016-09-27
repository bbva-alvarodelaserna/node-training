'use strict';

var _ = require('lodash');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env._NODE_ENV,
  host: process.env._IP || 'localhost',
  appName: 'node-training',
  routes: {
    prefix: '/v1/node-training'
  },
  salt: 'node-trainings4ltv4lu3'
};

console.log('Runing in ', process.env._NODE_ENV, 'mode');

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env._NODE_ENV) || {});

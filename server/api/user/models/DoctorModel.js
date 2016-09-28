'use strict';
var crypto  = require('crypto');
var uuid    = require('uuid');
var config  = require('../../../config/environment');

function DefaultModule(defaultModuleData) {
  return {
    email           : defaultModuleData.name,
    password        : crypto.createHash('sha256').update(defaultModuleData.password + config.salt, 'utf8').digest('base64'),
    uuid            : uuid.v4(),
    dateCreated     : new Date()
  };
}

module.exports = DefaultModule;

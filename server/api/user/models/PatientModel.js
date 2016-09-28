'use strict';

const crypto  = require('crypto');
const config  = require('../../../config/environment');
const Utils   = require('../../../components/utils');

function PatientModel (data) {
  return {
    email           : data.email,
    password        : crypto.createHash('sha256').update(data.password + config.salt, 'utf8').digest('base64'),
    firstName 		: data.firstName,
	lastName 		: data.lastName,
    uuid            : Utils.generateUuid(),
    dateCreated     : new Date(),
    appointments 	: []
  };
}

module.exports = PatientModel;

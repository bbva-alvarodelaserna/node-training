'use strict';

const crypto  = require('crypto');
const config  = require('../../../config/environment');
const Utils   = require('../../../components/utils');

function AppointmentModel (data) {
  return {
    uuid: Utils.generateUuid(),
    doctorId: data.doctorId,
    date: data.date
  };
}

module.exports = AppointmentModel;

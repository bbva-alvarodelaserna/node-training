'use strict';

let Responses     = require('../../../components/responses');
let Errors        = require('../../../components/errors');
let Utils         = require('../../../components/utils');
let PatientModel  = require('../models/PatientModel');
let DoctorModel   = require('../models/DoctorModel');
let log           = Utils.log;

exports.addUser = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - addUser Accessing');
    return resolve(data);
  });
};

exports.getUsers = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - getUsers Accessing');
    return resolve(data);
  });
};

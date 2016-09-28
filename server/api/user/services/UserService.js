'use strict';

let Responses     = require('../../../components/responses');
let Errors        = require('../../../components/errors');
let Utils         = require('../../../components/utils');
let PatientModel  = require('../models/PatientModel');
let DoctorModel   = require('../models/DoctorModel');
let MongoService  = require('../services/MongoService').getInstance();
let log           = Utils.log;

exports.addUser = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - addUser Accessing');
    let dataModel;
    if (data.payload.isDoctor) {
      dataModel = new DoctorModel(data.payload);
      log('info', data.logData, 'UserService - addUser - Doctor');
    } else {
      dataModel = new PatientModel(data.payload);
      log('info', data.logData, 'UserService - addUser - Patient');
    }

    MongoService.findAndModify(Object.assign(data, {
      query: {
        collection: 'users',
        query: { email: dataModel.email },
        data: dataModel,
        options: { upsert: true, new: true }
      }
    }))
    .then((result) => {
      log('info', data.logData, 'UserService | addUser OK');
      return resolve(result);
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | addUser KO', error);
      return reject(error);
    });
  });
};

exports.getUsers = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - getUsers Accessing');
    MongoService.find(Object.assign(data, {
      query: {
        collection: 'users',
        query: {},
        options: { sort: { email: 1} }
      }
    }))
    .then((result) => {
      data.users = result;
      log('info', data.logData, 'UserService | getUsers OK');
      return resolve(data);
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | getUsers KO', error);
      return reject(error);
    });
  });
};

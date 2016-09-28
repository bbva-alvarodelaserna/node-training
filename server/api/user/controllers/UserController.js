'use strict';

let Responses     = require('../../../components/responses');
let Errors        = require('../../../components/errors');
let Utils         = require('../../../components/utils');
let UserModelValidator  = require('../models/validators/UserModelJoi');
let log           = Utils.log;

let UserService   = require('../services/UserService');

exports.addUser = function(request, reply) {
  let data = {
    logData : Utils.logData(request),
    payload : request.payload,
    schema  : new UserModelValidator()
  };
  let response;

  log('info', data.logData, 'UserController - addUser Accessing');

  Utils.validateSchema(data)
  .then(UserService.addUser)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining201);
    log('info', data.logData, 'UserController - addUser OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - addUser KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

exports.getPatients = function(request, reply) {
  let data = {
    logData : Utils.logData(request)
  };
  let response;
  log('info', data.logData, 'UserController - getPatients Accessing');

  UserService.getPatients(data)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining200, result.users);
    log('info', data.logData, 'UserController - getPatients OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - getPatients KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

exports.getDoctors = function(request, reply) {
  let data = {
    logData : Utils.logData(request)
  };
  let response;
  log('info', data.logData, 'UserController - getDoctors Accessing');

  UserService.getDoctors(data)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining200, result.users);
    log('info', data.logData, 'UserController - getDoctors OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - getDoctors KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

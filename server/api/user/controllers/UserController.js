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
    payload : request.query,
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

exports.getUsers = function(request, reply) {
  let data = {
    logData : Utils.logData(request),
    payload : request.query
  };
  let response;
  log('info', data.logData, 'UserController - getUsers Accessing');

  Utils.validateSchema(data)
  .then(UserService.getUsers)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining200, result);
    log('info', data.logData, 'UserController - getUsers OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - getUsers KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

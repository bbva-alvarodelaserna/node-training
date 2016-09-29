'use strict';

let Responses     = require('../../../components/responses');
let Errors        = require('../../../components/errors');
let Utils         = require('../../../components/utils');
let UserModelValidator = require('../models/validators/UserModelJoi');
let AppointmentValidator = require('../models/validators/AppointmentJoi');
let log           = Utils.log;

let UserService   = require('../services/UserService');

exports.addUser = function(request, reply) {
  let data = {
    logData: Utils.logData(request),
    payload: request.payload,
    schema: new UserModelValidator()
  };
  let response;

  log('info', data.logData, 'UserController - addUser Accessing');

  Utils.validateSchema(data)
  .then(UserService.addUser)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining201, {userUuid: result.uuid});
    log('info', data.logData, 'UserController - addUser OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - addUser KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

exports.addAppointmentToPatient = function(request, reply) {
  let data = {
    logData: Utils.logData(request),
    payload: request.payload,
    params: request.params,
    schema: new AppointmentValidator()
  };
  let response;

  log('info', data.logData, 'UserController - addAppointmentToPatient Accessing');

  Utils.validateSchema(data)
  .then(UserService.addAppointmentToPatient)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining201, { appointmentUuid: result.user.appointments[result.user.appointments.length -1 ].uuid });
    log('info', data.logData, 'UserController - addAppointmentToPatient OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - addAppointmentToPatient KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

exports.deleteAppointment = function(request, reply) {
  let data = {
    logData: Utils.logData(request),
    params: request.params
  };
  let response;
  log('info', data.logData, 'UserController - deleteAppointment Accessing');

  UserService.deleteAppointment(data)
  .then(() => {
    response = Utils.createResponseData(Responses.nodetraining000, { appointmentUuid: data.params.appointmentUuid });
    log('info', data.logData, 'UserController - deleteAppointment OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - deleteAppointment KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

exports.getPatientsForDoctor = function(request, reply) {
  let data = {
    logData: Utils.logData(request),
    params: request.params
  };
  let response;

  log('info', data.logData, 'UserController - getPatientsForDoctor Accessing');

  UserService.getPatientsForDoctor(data)
  .then((result) => {
    response = Utils.createResponseData(Responses.nodetraining200, result.users);
    log('info', data.logData, 'UserController - getPatientsForDoctor OK response', response);
    return reply(response).code(response.result.statusCode);
  })
  .catch((err) => {
    response = Errors.createGeneralError(err);
    log('error', data.logData, 'UserController - getPatientsForDoctor KO - Error: ', response);
    return reply(response).code(err.statusCode);
  });
};

exports.getPatients = function(request, reply) {
  let data = {
    logData: Utils.logData(request)
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
    logData: Utils.logData(request)
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

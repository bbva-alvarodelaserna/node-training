'use strict';

let Utils         = require('../../../components/utils');
let Responses     = require('../../../components/responses');
let PatientModel  = require('../models/PatientModel');
let DoctorModel   = require('../models/DoctorModel');
let AppointmentModel = require('../models/AppointmentModel');
let MongoService  = require('../services/MongoService').getInstance();
let log           = Utils.log;

/**
 * Adds a new user to the database based on its isDoctor parameter
 * @public
 * @param {Object} data - Request object
 * @param {Object} data.payload - Request payload
 * @param {Boolean} data.payload.isDoctor - Specifies if user is doctor or patient
 * @returns {Promise}
 * @returns {Object} result - Operation acknowledgement
 */
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

    MongoService.findOne(Object.assign(data, {
      query: {
        collection: data.payload.isDoctor ? 'doctors':'patients',
        query: { email: dataModel.email }
      }
    }))
    .then((user) => {
      if (user) {
        return reject(Responses.nodetraining409);
      } else {
        MongoService.findAndModify(Object.assign(data, {
          query: {
            collection: data.payload.isDoctor ? 'doctors':'patients',
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
      }
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | addUser KO', error);
      return reject(error);
    });
  });
};

/**
 * Adds a new appointment to a user
 * @public
 * @param {Object} data - Request object
 * @param {Object} data.payload - Request payload
 * @param {Object} data.params - Request parameters
 * @param {Boolean} data.params.userUuid - Patient UUID
 * @returns {Promise}
 * @returns {Object} result - Operation acknowledgement
 */
exports.addAppointmentToPatient = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - addAppointmentToPatient Accessing');

    let model = new AppointmentModel(data.payload);
    MongoService.findAndModify(Object.assign(data, {
      query: {
        collection: 'patients',
        query: { uuid: data.params.userUuid },
        data: { $push: { appointments: model } },
        options: { new: true }
      }
    }))
    .then((result) => {
      log('info', data.logData, 'UserService | addAppointmentToPatient OK');
      return resolve(result);
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | addAppointmentToPatient KO', error);
      return reject(error);
    });
  });
};

/**
 * Deletes an existing appointment from a user
 * @public
 * @param {Object} data - Request object
 * @param {Object} data.params - Request parameters
 * @param {Boolean} data.params.userUuid - Patient UUID
 * @param {Boolean} data.params.appointmentUuid - Appointment UUID
 * @returns {Promise}
 * @returns {Object} result - Operation acknowledgement
 */
exports.deleteAppointment = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - deleteAppointment Accessing');

    MongoService.findOne(Object.assign(data, {
      query: {
        collection: 'patients',
        query: { 'appointments.uuid': data.params.appointmentUuid }
      }
    }))
    .then((result) => {
      if (!result) {
        return reject(Responses.nodetraining400);
      } else {
        MongoService.findAndModify(Object.assign(data, {
          query: {
            collection: 'patients',
            query: { uuid: data.params.userUuid },
            data: { $pull: { appointments: { uuid: data.params.appointmentUuid } } },
            options: { new: true }
          }
        }))
        .then((res) => {
          log('info', data.logData, 'UserService | deleteAppointment OK');
          return resolve(res);
        })
        .catch((error) => {
          log('error', data.logData, 'UserService | deleteAppointment KO', error);
          return reject(error);
        });
      }
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | deleteAppointment KO', error);
      return reject(error);
    });
  });
};

/**
 * Retrieves a list of patients from the database
 * @public
 * @param {Object} data - Request object
 * @returns {Promise}
 * @returns {Object} data.users - Array of user documents
 */
exports.getPatients = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - getPatients Accessing');
    MongoService.find(Object.assign(data, {
      query: {
        collection: 'patients',
        query: { },
        options: { sort: { email: 1} }
      }
    }))
    .then((result) => {
      data.users = result;
      log('info', data.logData, 'UserService | getPatients OK');
      return resolve(data);
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | getPatients KO', error);
      return reject(error);
    });
  });
};

/**
 * Retrieves a list of patients from the database for a specific doctor
 * @public
 * @param {Object} data - Request object
 * @param {Object} data.params - Request parameters
 * @param {Boolean} data.params.doctorUuid - Doctor UUID
 * @returns {Promise}
 * @returns {Object} data.users - Array of user documents
 */
exports.getPatientsForDoctor = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - getPatientsForDoctor Accessing');
    MongoService.find(Object.assign(data, {
      query: {
        collection: 'patients',
        query: { 'appointments.doctorId': data.params.doctorUuid },
        options: { sort: { email: 1} }
      }
    }))
    .then((result) => {
      data.users = result;
      log('info', data.logData, 'UserService | getPatientsForDoctor OK');
      return resolve(data);
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | getPatientsForDoctor KO', error);
      return reject(error);
    });
  });
};

/**
 * Retrieves a list of doctors from the database
 * @public
 * @param {Object} data - Request object
 * @returns {Promise}
 * @returns {Object} data.users - Array of user documents
 */
exports.getDoctors = function(data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'UserService - getDoctors Accessing');
    MongoService.find(Object.assign(data, {
      query: {
        collection: 'doctors',
        query: {},
        options: { sort: { email: 1} }
      }
    }))
    .then((result) => {
      data.users = result;
      log('info', data.logData, 'UserService | getDoctors OK');
      return resolve(data);
    })
    .catch((error) => {
      log('error', data.logData, 'UserService | getDoctors KO', error);
      return reject(error);
    });
  });
};

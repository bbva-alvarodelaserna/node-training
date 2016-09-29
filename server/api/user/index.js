'use strict';

const UserController = require('./controllers/UserController');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/users/patients',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Retrieves all patients from the database'
    },
    handler: UserController.getPatients
  });

  server.route({
    method: 'GET',
    path: '/users/patients/{doctorUuid}',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Retrieves all patients from the database for a specific doctor'
    },
    handler: UserController.getPatientsForDoctor
  });

  server.route({
    method: 'GET',
    path: '/users/doctors',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Retrieves all doctors from the database'
    },
    handler: UserController.getDoctors
  });

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Add a user to the database'
    },
    handler: UserController.addUser
  });

  server.route({
    method: 'POST',
    path: '/users/{userUuid}/appointment',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Add an appointment to a user'
    },
    handler: UserController.addAppointmentToPatient
  });

  server.route({
    method: 'DELETE',
    path: '/users/{userUuid}/appointment/{appointmentUuid}',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Deletes an appointment from a user'
    },
    handler: UserController.deleteAppointment
  });

};

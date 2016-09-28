'use strict';

const UserController = require('./controllers/UserController');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/users',
    config: {
      auth: false,
      tags: ['api', 'users'],
      description: 'Retrieves all users from the database'
    },
    handler: UserController.getUsers
  });

};
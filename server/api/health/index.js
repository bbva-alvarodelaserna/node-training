'use strict';

const Health = require('./healthController');

module.exports = function(server) {

  server.route({
    method: 'GET',
    path: '/health',
    config: {
      auth: false,
      tags: ['api', 'health'],
    },
    handler: Health.healthCheck
  });

};

'use strict';

var defaultModuleController = require('./defaultModuleController');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/defaultModule',
    config: {
      auth: false,
      tags: ['api', 'defaultModule'],
      description: 'Default defaultModule get request'
    },
    handler: function(request, reply, next) {
  defaultModuleController.getDefaultModule(request, reply, next);
    }
  });

};

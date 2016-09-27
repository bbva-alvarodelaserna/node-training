/**
 * Main application routes
 */

'use strict';

exports.register = function(server, options, next) {
  
  /* Required API endpoints */
  
  require('./api/health')(server);
  require('./api/defaultModule')(server); 
 /* routesinject */

  next();
};

exports.register.attributes = {
  name: 'node-training-routes',
  version: '0.0.1'
};

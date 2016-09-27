/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env._NODE_ENV = process.env._NODE_ENV || 'development';

var Hapi          = require('hapi');
var config        = require('./config/environment');
var GlobalModule  = require('./components/global.js');


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({port: config.port , routes: { cors: true }});


// Register the server and start the application
server.register([
    {register: require('./routes')},
    {register: require('hapi-mongodb'),options: config.mongoSettings},
    {register: require('inert')},
    {register: require('vision')}
  ],
  {routes: {prefix: config.routes.prefix}},

  function(err) {
    if (err) {
      throw err;
    }
    server.start(function() {
      console.log('Server running at', server.info.uri);
      GlobalModule.setConfigValue('db', server.plugins['hapi-mongodb'].db);
    });
  }
);

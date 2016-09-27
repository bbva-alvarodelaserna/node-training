'use strict';

var defaultModuleResponses = require('./defaultModuleResponses');

var Errors        = require('../../components/errors');
var Utils         = require('../../components/utils');
var DefaultModuleModelJoi  = require('./models/defaultModuleModelJoi');
var _defaultModuleUtils    = require('./defaultModuleUtils');
var log           = Utils.log;

exports.getDefaultModule = function(request, reply) {
  var data = {
    logData : Utils.logData(request),
    payload : request.query,
    schema  : new DefaultModuleModelJoi()
  };
  var response;
  log('info', data.logData, 'getDefaultModule Accessing');

  Utils.validateSchema(data)
    .then(_defaultModuleUtils.defaultAction)
    .then(function(){
      response = Utils.createResponseData(defaultModuleResponses.all_ok);
      log('info', data.logData, 'getDefaultModule OK response', response);
      return reply(response).code(response.result.statusCode);
    })
    .fail(function(err){
      response = Errors.createGeneralError(err);
      log('error', data.logData, 'getDefaultModule KO - Error: ', response);
      return reply(response).code(err.statusCode);
    });
};

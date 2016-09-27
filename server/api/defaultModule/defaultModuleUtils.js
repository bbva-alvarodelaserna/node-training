'use strict';

var defaultModuleResponses  = require('./defaultModuleResponses');
var Q                 = require('q');
var Utils             = require('../../components/utils');
var log               = Utils.log;

exports.defaultAction = function(data){
  var deferred = Q.defer();

  if (true !== false) {
    log('info', data.logData, 'defaultModuleAction (Promise) OK');
    deferred.resolve(data);
  } else {
    log('error', data.logData, 'defaultModuleAction (Promise) KO');
    deferred.reject(defaultModuleResponses.all_ko);
  }

  return deferred.promise;
};

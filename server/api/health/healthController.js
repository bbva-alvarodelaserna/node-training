'use strict';

const Utils           = require('../../components/utils');
let log             = Utils.log;
const GlobalModule    = require('../../components/global');

const USERS_NAME_COLLECTION = 'users';

exports.healthCheck = function(request, reply) {
  let logData = Utils.logData(request);
  log('info', logData, 'healthCheck', request.payload);
  let colUser = GlobalModule.getConfigValue('db').collection(USERS_NAME_COLLECTION);

  colUser.findOne({}, {}, function (err) {
    if (err) {
      log('error', logData, 'healthCheck DDBB KO');
      return reply({'status': 'KO'}).code(500);
    } else {
      log('info', logData, 'healthCheck DDBB OK');
      return reply({'status': 'OK'}).code(200);
    }
  });
};

'use strict';

var responses = require('../../components/responses');

module.exports = {
  internal_ddbb_error: {
    statusCode: 500,
    code: responses.nodetraining500.code,
    message: 'Internal DDBB Error'
  },

  all_ok: {
    statusCode: 200,
    code: responses.nodetraining200.code,
    message: 'Yay! all good'
  },

  all_ko: {
    statusCode: 400,
    code: responses.nodetraining400.code,
    message: 'Nay! all bad'
  }
};

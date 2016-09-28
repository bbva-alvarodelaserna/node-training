'use strict';

const Joi = require('joi');

function UserModelJoi() {
  let schema = Joi.object().keys({
    email       : Joi.string().email().required(),
    password    : Joi.string().min(6).max(20).required(),
    firstName   : Joi.string().required(),
    lastName    : Joi.string().required(),
    isDoctor    : Joi.boolean().required()
  });
  return schema;
}

module.exports = UserModelJoi;

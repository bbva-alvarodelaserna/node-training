'use strict';

const Joi = require('joi');

function AppointmentJoi() {
  let schema = Joi.object().keys({
    doctorId: Joi.string().guid().required(),
    date: Joi.object().keys({
      day: Joi.number().max(31).required(),
      month: Joi.number().max(12).required(),
      year: Joi.number().min(2016).required()
    })
  });
  return schema;
}

module.exports = AppointmentJoi;

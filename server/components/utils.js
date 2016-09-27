'use strict';

const uuid          = require('uuid');
const GlobalModule  = require('./global');
const Joi           = require('joi');
const config        = require('../config/environment');
const crypto        = require('crypto');
const util          = require('util');
let req             = require('request');
let w               = require('winston');
w.level             = config.loggerLevel;

exports.getCollection = function(colName) {
  return GlobalModule.getConfigValue('db').collection(colName);
};

exports.generateUuid = function() {
  return uuid.v4();
};

exports.generateToken = function(bytes, format){
  return crypto.randomBytes(bytes).toString(format);
};

exports.encryptText = function (encText) {
  let algorithm = 'aes-256-ctr';
  let text = String(encText);
  let cipher = crypto.createCipher(algorithm, config.salt);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.decryptText = function (text) {
  let algorithm = 'aes-256-ctr';
  let decipher = crypto.createDecipher(algorithm, config.salt);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

exports.createResponseData = function(result, data) {
  let response = {
    result: result
  };
  if (data) {
    response.data = data;
  }
  return response;
};

exports.sendRequest = function (data) {
  return new Promise((resolve, reject) => {
    log('info', data.logData, 'Utils sending request', data.reqData);
    req(data.reqData, function(error, response, body) {
      if (typeof body === 'string') {
        try{
          body = JSON.parse(body);
        } catch(e) {
          body = {};
        }
      }
      data.reqData.body = body;
      data.reqData.response = response;

      if (error) {
        log('error', data.logData, 'Utils request failed', error);
        return reject(error);
      } else {
        log('info', data.logData, 'Utils request received', body);
        return resolve(data);
      }
    });
  });
};

exports.logData = function(request) {
  return {
    method: request.method.toUpperCase(),
    uuid: this.generateUuid(),
    path: request.path
  };
};

exports.validateSchema = function(data) {
  return new Promise((resolve, reject) => {
    Joi.validate(data.payload, data.schema, function(err) {
      if (err) {
        let error = {
          message : err.details[0].message,
          code    : 400,
          statusCode    : 400
        };
        return reject(error);
      } else {
        return resolve(data);
      }
    });
  });
};

exports.log = log

function log(...params){
  console.log(params);
}
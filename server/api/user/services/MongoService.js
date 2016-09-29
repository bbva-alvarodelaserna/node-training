'use strict';

let GenericResponses = require('../../../components/responses');
let Utils = require('../../../components/utils');
let log = Utils.log;

/** Class for managing database operations, using MongoDB driver for Hapi. */
class MongoService {

  /**
   * Retrieves a collection in the database based on its name 
   * @public
   * @param {String} colName - Name of the collection
   * @returns {Promise}
   * @returns {Object} db.collection - Reference to the collection
   */
  getCollection(colName) {
    return Utils.getCollection(colName);
  }

  /**
   * Calls db.collection.find() with the corresponding parameters
   * @public
   * @param {Object} data - Request object
   * @param {Object} data.query - Object containing query specifications
   * @returns {Promise}
   * @returns {Object} result - Array of one or more elements containing the retrieved documents
   */
  find(data) {
    log('info', data.logData, 'MongoService | find');
    return new Promise((resolve, reject) => {
      let repository = this.getCollection(data.query.collection);
      if (data.query.options && data.query.options.sort) {
        repository.find(data.query.query, {_id: 0}).sort(data.query.options.sort).toArray(function (err, result) {
          if (err) {
            log('error', data.logData, 'MongoService | find - Internal DDBB Error');
            return reject(GenericResponses.internalDDBBError);
          } else {
            log('info', data.logData, 'MongoService | find - OK');
            return resolve(result);
          }
        });
      } else {
        repository.find(data.query.query).toArray(function (err, result) {
          if (err) {
            log('error', data.logData, 'MongoService | find - Internal DDBB Error');
            return reject(GenericResponses.internalDDBBError);
          } else {
            log('info', data.logData, 'MongoService | find - OK');
            return resolve(result);
          }
        });
      }
    });
  }

  /**
   * Calls db.collection.findOne() with the corresponding parameters
   * @public
   * @param {Object} data - Request object
   * @param {Object} data.query - Object containing query specifications
   * @returns {Promise}
   * @returns {Object} result - Retrieved document
   */
  findOne(data) {
    log('info', data.logData, 'MongoService | findOne');
    return new Promise((resolve, reject) => {
      let repository = this.getCollection(data.query.collection);
      repository.findOne(data.query.query, {_id: 0}, function (err, result) {
        if (err) {
          log('error', data.logData, 'MongoService | findOne - Internal DDBB Error');
          return reject(GenericResponses.internalDDBBError);
        } else {
          log('info', data.logData, 'MongoService | findOne - OK');
          return resolve(result);
        }
      });
    });
  }

  /**
   * Calls db.collection.findAndModify() with the corresponding parameters
   * @public
   * @param {Object} data - Request object
   * @param {Object} data.query - Object containing query specifications
   * @returns {Promise}
   * @returns {Object} result - Updated document
   */
  findAndModify(data) {
    log('info', data.logData, 'MongoService | findAndModify');
    return new Promise((resolve, reject) => {
      let repository = this.getCollection(data.query.collection);
      repository.findAndModify(data.query.query, [['uuid', 1]], data.query.data, data.query.options, function (err, result) {
        if (err || !result) {
          log('error', data.logData, 'MongoService | findAndModify - Internal DDBB Error');
          return reject(GenericResponses.internalDDBBError);
        } else {
          log('info', data.logData, 'MongoService | findAndModify - OK');
          data.user = result.value;
          return resolve(data);
        }
      });
    });
  }
}

let instance;

exports.getInstance = function () {
  if(!instance) {
    instance = new MongoService();
  }
  return instance;
};
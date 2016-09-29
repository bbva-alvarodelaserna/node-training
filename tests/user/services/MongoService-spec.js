'use strict';

const rewire = require('rewire');

describe('MongoService functions', function () {

  let MongoService, UtilsMock, GenericResponsesMock;
  let controller;

  beforeEach(()=>{
    MongoService = rewire('../../../server/api/user/services/MongoService.js');
    controller = MongoService.getInstance();

    UtilsMock = {
      log: jasmine.createSpy('log'),
      getCollection: jasmine.createSpy('getCollection')
    };
    GenericResponsesMock = {
      internalDDBBError: 'internalDDBBError'
    };
    
    MongoService.__set__('Utils', UtilsMock);
    MongoService.__set__('log', UtilsMock.log);
    MongoService.__set__('GenericResponses', GenericResponsesMock);
  });

  it('should be defined on initialization', () => {
    expect(controller).toBeDefined();
  });

  describe('getCollection', function () {
    beforeEach(() => {
      UtilsMock.getCollection.and.returnValue({
        key: 'value'
      });
    });
    it('should return the collection object', function () {
      let result = controller.getCollection('foo');
      expect(result).toEqual({key:'value'});
    });
  });

  describe('findOne', function () {
    let getCollectionMock, mockData, mockResult;
    beforeEach(() => {
      getCollectionMock = jasmine.createSpy('getCollection');
      mockData = {
        logData: 'logData',
        query: {
          collection: 'foo',
          query: 'foo'
        }
      };
      mockResult = mockData;
    });

    it('should call repository.findOne with the correct input parameters', function (done) {
      getCollectionMock.and.returnValue({
        findOne: jasmine.createSpy('findOne')
      });
      controller.getCollection = getCollectionMock;

      controller.findOne(mockData);
      expect(getCollectionMock().findOne).toHaveBeenCalledWith(mockData.query.query, {_id: 0}, jasmine.any(Function));
      done();
    });

    it('should reject promise if repository.findOne returns an error', function (done) {
      getCollectionMock.and.returnValue({
        findOne: function (obj, obj2, callback) {
          callback(true, undefined);
        }
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.findOne(mockData);
      promise.then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(GenericResponsesMock.internalDDBBError);
        done();
      });
    });

    it('should resolve promise if repository.findOne does not return an error', function (done) {
      getCollectionMock.and.returnValue({
        findOne: function (obj, obj2, callback) {
          callback(undefined, mockResult);
        }
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.findOne(mockData);
      promise.then((result) => {
        expect(result).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been rejected');
      });
    });
  });

  describe('findAndModify', function () {
    let getCollectionMock, mockData, mockResult;
    beforeEach(()=>{
      getCollectionMock = jasmine.createSpy('getCollection');
      mockData = {
        logData: 'logData',
        query: {
          collection: 'foo',
          query: 'foo',
          sort: 'foo',
          data: 'foo',
          options: 'foo'
        }
      };
      mockResult = {
        value: {
          key: 'value'
        }
      };
    });

    it('should call repository.findAndModify with the correct input parameters', function (done) {
      getCollectionMock.and.returnValue({
        findAndModify: jasmine.createSpy('findAndModify')
      });
      controller.getCollection = getCollectionMock;

      controller.findAndModify(mockData);
      expect(getCollectionMock().findAndModify).toHaveBeenCalledWith(mockData.query.query, [['uuid', 1]], mockData.query.data, mockData.query.options, jasmine.any(Function));
      done();
    });

    it('should reject promise if repository.findAndModify returns an error', function (done) {
      getCollectionMock.and.returnValue({
        findAndModify: function (obj, obj2, obj3, obj4, callback) {
          callback(true, undefined);
        }
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.findAndModify(mockData);
      promise.then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(GenericResponsesMock.internalDDBBError);
        done();
      });
    });

    it('should reject promise if repository.findAndModify returns an undefined result', function (done) {
      getCollectionMock.and.returnValue({
        findAndModify: function (obj, obj2, obj3, obj4, callback) {
          callback(undefined, undefined);
        }
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.findAndModify(mockData);
      promise.then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(GenericResponsesMock.internalDDBBError);
        done();
      });
    });

    it('should resolve promise if repository.findAndModify does not return an undefined result', function (done) {
      getCollectionMock.and.returnValue({
        findAndModify: function (obj, obj2, obj3, obj4, callback) {
          callback(undefined, mockResult);
        }
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.findAndModify(mockData);
      promise.then((result) => {
        expect(result.user).toEqual(mockResult.value);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been rejected');
      });
    });
  });

  describe('find', function () {
    let getCollectionMock, mockData, mockResult;
    beforeEach(()=>{
      getCollectionMock = jasmine.createSpy('getCollection');
      mockData = {
        logData: 'logData',
        query: {
          collection: 'foo',
          query: 'foo',
          options: {
            sort: { userUuid: 1 }
          }
        }
      };
      mockResult = mockData;
    });

    it('should call repository.find with the correct input parameters', function (done) {
      getCollectionMock.and.returnValue({
        find: jasmine.createSpy('find')
      });
      controller.getCollection = getCollectionMock;

      controller.find(mockData);
      expect(getCollectionMock().find).toHaveBeenCalledWith(mockData.query.query, {_id: 0});
      done();
    });

    it('should reject promise if repository.find.sort.toArray returns an error', function (done) {
      getCollectionMock.and.returnValue({
        find: jasmine.createSpy('find').and.returnValue({
          sort: jasmine.createSpy('sort').and.returnValue({
            toArray: function (callback) {
              callback(true, undefined)
            }
          })
        })
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.find(mockData);
      promise.then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(GenericResponsesMock.internalDDBBError);
        done();
      });
    });

    it('should resolve promise if repository.find does not return an error', function (done) {
      getCollectionMock.and.returnValue({
        find: jasmine.createSpy('find').and.returnValue({
          sort: jasmine.createSpy('sort').and.returnValue({
            toArray: function (callback) {
              callback(undefined, mockResult)
            }
          })
        })
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.find(mockData);
      promise.then((result) => {
        expect(result).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been rejected');
      });
    });

    it('should call repository.find with the correct input parameters', function (done) {
      mockData.query.options.sort = undefined;
      getCollectionMock.and.returnValue({
        find: jasmine.createSpy('find')
      });
      controller.getCollection = getCollectionMock;

      controller.find(mockData);
      expect(getCollectionMock().find).toHaveBeenCalledWith(mockData.query.query);
      done();
    });

    it('should reject promise if repository.find.sort.toArray returns an error', function (done) {
      mockData.query.options.sort = undefined;
      getCollectionMock.and.returnValue({
        find: jasmine.createSpy('find').and.returnValue({
          toArray: function (callback) {
            callback(true, undefined)
          }
        })
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.find(mockData);
      promise.then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(GenericResponsesMock.internalDDBBError);
        done();
      });
    });

    it('should resolve promise if repository.find does not return an error', function (done) {
      mockData.query.options.sort = undefined;
      getCollectionMock.and.returnValue({
        find: jasmine.createSpy('find').and.returnValue({
          toArray: function (callback) {
            callback(undefined, mockResult)
          }
        })
      });
      controller.getCollection = getCollectionMock;

      let promise = controller.find(mockData);
      promise.then((result) => {
        expect(result).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been rejected');
      });
    });
  });
});
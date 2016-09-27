'use strict';

const rewire = require('rewire');

describe('Health check', function () {

  let health, req, rep, next;
  let UtilsMock, GlobalModuleMock;

  beforeEach(() => {
    health = rewire('../../server/api/health/healthController.js');
    req = {};
    next = function (res) {};

    UtilsMock = {
      logData: jasmine.createSpy('logData').and.returnValue({
        method: 'TEST',
        uuid: '123-TEST',
        path: 'TEST/PATH'
      }),
      log: jasmine.createSpy('log')
    };
    
    GlobalModuleMock = {
      getConfigValue: jasmine.createSpy('getConfigValue').and.returnValue({
        collection: jasmine.createSpy('collection')
      })
    };
    health.__set__('Utils.logData', UtilsMock.logData);
    health.__set__('log', UtilsMock.log);
    health.__set__('GlobalModule.getConfigValue', GlobalModuleMock.getConfigValue);
  });

  it('should return health KO', function () {
    let code = jasmine.createSpy('code');
    let rep = jasmine.createSpy('rep').and.callFake(function () {
      return {
        code: code
      };
    });
    GlobalModuleMock.getConfigValue().collection.and.returnValue({
      findOne: function (obj1, obj2, callback) {
        callback(true);
      }
    });
    health.healthCheck(req, rep, next);

    expect(rep).toHaveBeenCalledWith({'status': 'KO'});
    expect(code).toHaveBeenCalledWith(500);
    expect(UtilsMock.log.calls.count()).toBe(2);
  });

  it('should return health OK', function () {
    let code = jasmine.createSpy('code');
    let rep = jasmine.createSpy('rep').and.callFake(function () {
      return {
        code: code
      };
    });
    GlobalModuleMock.getConfigValue().collection.and.returnValue({
      findOne: function (obj1, obj2, callback) {
        callback(undefined);
      }
    });
    health.healthCheck(req, rep, next);

    expect(rep).toHaveBeenCalledWith({'status': 'OK'});
    expect(code).toHaveBeenCalledWith(200);
    expect(UtilsMock.log.calls.count()).toBe(2);
  });
});

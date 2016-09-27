'use strict';

const rewire = require('rewire');

describe('Utils functions', function () {

	let utils = rewire('../../server/components/utils.js');
  let GlobalModuleMock;
	
  beforeEach(() => {
    utils = rewire('../../server/components/utils.js');
    GlobalModuleMock = {
      getConfigValue: jasmine.createSpy('getConfigValue')
    };
    utils.__set__('GlobalModule.getConfigValue', GlobalModuleMock.getConfigValue);
  });

	it('getCollection: should call GlobalModule with the right parameters', function () {
    let coll = jasmine.createSpy('coll');
    GlobalModuleMock.getConfigValue.and.callFake(function () {
      return {
        collection: coll
      }
    });

    utils.getCollection('testCol');
    expect(GlobalModuleMock.getConfigValue).toHaveBeenCalledWith('db');
    expect(coll).toHaveBeenCalledWith('testCol');
  });

  it('generateUuid: should return a valid UUID', function () {
		expect(utils.generateUuid()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  });

  it('generateToken: should return a valid Token', function () {
		let token = utils.generateToken(12);
		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);
  });

  it('logData: should return a valid logData response', function () {
		let reqData = {
			method: 'TEST',
			path: 'TEST/PATH',
			testData: 'NOT SHOW'
		};
		let resultData = utils.logData(reqData);
		expect(typeof resultData).toBe('object');
		expect(resultData.method).toEqual(reqData.method);
		expect(resultData.path).toEqual(reqData.path);
		expect(resultData.testData).toBe(undefined);
		expect(resultData.uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  });

  describe('createResponseData function', function () {
    it('createResponseData: should return a response data', function () {
      let resultData = utils.createResponseData('test', 'me');
      let expectedResult = {
        result: 'test',
        data: 'me'
      };
      expect(typeof resultData).toBe('object');
      expect(resultData).toEqual(expectedResult);
    });

    it('createResponseData: should return a response data without data', function () {
      let resultData = utils.createResponseData('test');
      let expectedResult = {
        result: 'test'
      };
      expect(typeof resultData).toBe('object');
      expect(resultData).toEqual(expectedResult);
      expect(resultData.data).toBe(undefined);
    });
  });

  describe('encryptText function', function () {
    it('encryptText: should return a hex string', function () {
      expect(utils.encryptText('hello')).toMatch(/[0-9A-Fa-f]{6}/g);
    });

    it('encryptText and then decryptText on a value should return the same value', function () {
      let textToEncrypt = 'testEncryption';
      let encripted = utils.encryptText(textToEncrypt);

      expect(utils.decryptText(encripted)).toBe(textToEncrypt);
    });
  });

  describe('validateSchema function', function () {
    it('validateSchema to call Joi.validate with the correct parameters', function () {
      let validateSpy = jasmine.createSpy('validateSpy').and.callFake(function (payload, schema, callback) {
        callback(undefined);
      });
      let joiSpy = {
        validate: validateSpy
      };

      utils.__set__('Joi.validate', joiSpy.validate);

      let data = {
        payload: {},
        schema: {}
      };

      utils.validateSchema(data);

      expect(validateSpy).toHaveBeenCalledWith(data.payload, data.schema, jasmine.any(Function));
    });

    it('validateSchema to return an error if callback from Joi.validate is invalid', function (done) {
      let errorObject = {
        details: [
          {
            message: 'testError'
          }
        ]
      };
      let validateSpy = jasmine.createSpy('validateSpy').and.callFake(function (payload, schema, callback) {
        callback(errorObject);
      });
      let joiSpy = {
        validate: validateSpy
      };

      utils.__set__('Joi.validate', joiSpy.validate);

      let data = {
        payload: {},
        schema: {}
      };
      utils.validateSchema(data)
        .then((response) => {
          done().fail('Promise should NOT be resolved');
        }).catch((err) => {
        done();
      });
    });

    it('validateSchema to return a valid response if Joi.validate is valid', function () {
      let validateSpy = jasmine.createSpy('validateSpy').and.callFake(function (payload, schema, callback) {
        callback(undefined);
      });
      let joiSpy = {
        validate: validateSpy
      };

      utils.__set__('Joi.validate', joiSpy.validate);

      let data = {
        payload: {},
        schema: {}
      };
      utils.validateSchema(data)
        .then((response) => {
          done();
        }).catch((err) => {
        done().fail('Promise should be resolved');
      });
    });

  });

  describe('Send request function', function () {
    let data, body, mockResponse, requestMock;

    beforeEach(function() {
      data = {
        reqData: {
          method: 'TEST',
          url: 'TEST'
        }
      };
      requestMock = jasmine.createSpy('reqSpy');
      utils.__set__('req', requestMock);
      spyOn(utils, 'log');
    });

    it('should call the req library with the correct parameters', function () {
      utils.sendRequest(data);

      expect(requestMock).toHaveBeenCalled();
      expect(1).toBe(1);
      expect(requestMock.calls.argsFor(0)[0]).toEqual(data.reqData);
    });

    it ('should return an empty object if request fails', function (done) {
      requestMock.and.callFake(function (data, callback) {
        callback(undefined, {}, 'BadResponseString');
      });
      utils.sendRequest(data)
      .then((response) => {
        body = response.reqData.body;
        expect(body).toEqual({});
        done();
      })
      .catch((err) => {
        done.fail('Promise should be resolved');
      });
    })
  });
});

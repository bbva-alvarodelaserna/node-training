'use strict';

const rewire = require('rewire');

describe('UserController functions', function () {

  let UserController, UserServiceMock, UtilsMock, ResponsesMock, ErrorsMock, UserModelValidatorMock, AppointmentValidatorMock;

  beforeEach(()=>{
    UserController = rewire('../../../server/api/user/controllers/UserController.js');

    UtilsMock = {
      log: jasmine.createSpy('log'),
      logData: jasmine.createSpy('logData').and.returnValue('logData'),
      validateSchema: jasmine.createSpy('validateSchema'),
      createResponseData: jasmine.createSpy('createResponseData')
    };
    ResponsesMock = {
      nodetraining201: 'nodetraining201',
      nodetraining000: 'nodetraining000',
      nodetraining200: 'nodetraining200'
    };
    ErrorsMock = {
      createGeneralError: jasmine.createSpy('createGeneralError')
    };
    UserModelValidatorMock = jasmine.createSpy('UserModelValidator');
    AppointmentValidatorMock = jasmine.createSpy('AppointmentValidator');
    UserServiceMock = {
      addUser: jasmine.createSpy('addUser'),
      addAppointmentToPatient: jasmine.createSpy('addAppointmentToPatient'),
      deleteAppointment: jasmine.createSpy('deleteAppointment'),
      getPatientsForDoctor: jasmine.createSpy('getPatientsForDoctor'),
      getPatients: jasmine.createSpy('getPatients'),
      getDoctors: jasmine.createSpy('getDoctors')
    };

    UserController.__set__('Utils', UtilsMock);
    UserController.__set__('log', UtilsMock.log);
    UserController.__set__('Responses', ResponsesMock);
    UserController.__set__('Errors', ErrorsMock);
    UserController.__set__('UserModelValidator', UserModelValidatorMock);
    UserController.__set__('AppointmentValidator', AppointmentValidatorMock);
    UserController.__set__('UserService', UserServiceMock);
  });

  it('should be defined on initialization', () => {
    expect(UserController).toBeDefined();
  });

  describe('addUser', () => {
    let requestMock, replyMock, mockResult;
    beforeEach(() => {
      requestMock = {
        payload: {
          key: 'value'
        }
      };
      mockResult = {
        user: {
          uuid: '123'
        }
      };
    });

    it('should reply with an error if Utils.validateSchema returns an error', (done) => {
      UtilsMock.validateSchema.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith('error');
            done();
          }
        }
      });
      UserController.addUser(requestMock, replyMock);
    });

    it('should reply with a normal response if everything succeeds', (done) => {
      UtilsMock.validateSchema.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });
      UserServiceMock.addUser.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(UtilsMock.createResponseData).toHaveBeenCalledWith(ResponsesMock.nodetraining201, {userUuid: mockResult.user.uuid});
            done();
          }
        }
      });
      UserController.addUser(requestMock, replyMock);
    });
  });

  describe('addAppointmentToPatient', () => {
    let requestMock, replyMock, mockResult;
    beforeEach(() => {
      requestMock = {
        payload: {
          key: 'value'
        }
      };
      mockResult = {
        user: {
          appointments: [{uuid: '123'}]
        }
      };
    });

    it('should reply with an error if UserService.addAppointmentToPatient returns an error', (done) => {
      UtilsMock.validateSchema.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });
      UserServiceMock.addAppointmentToPatient.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith('error');
            done();
          }
        }
      });
      UserController.addAppointmentToPatient(requestMock, replyMock);
    });

    it('should reply with a normal response if everything succeeds', (done) => {
      UtilsMock.validateSchema.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });
      UserServiceMock.addAppointmentToPatient.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(UtilsMock.createResponseData).toHaveBeenCalledWith(ResponsesMock.nodetraining201, {appointmentUuid: mockResult.user.appointments[0].uuid});
            done();
          }
        }
      });
      UserController.addAppointmentToPatient(requestMock, replyMock);
    });
  });

  describe('deleteAppointment', () => {
    let requestMock, replyMock;
    beforeEach(() => {
      requestMock = {
        params: {
          appointmentUuid: '123'
        }
      };
    });

    it('should reply with an error if UserService.deleteAppointment returns an error', (done) => {
      UserServiceMock.deleteAppointment.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith('error');
            done();
          }
        }
      });
      UserController.deleteAppointment(requestMock, replyMock);
    });

    it('should reply with a normal response if everything succeeds', (done) => {
      UserServiceMock.deleteAppointment.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(UtilsMock.createResponseData).toHaveBeenCalledWith(ResponsesMock.nodetraining000, {appointmentUuid: requestMock.params.appointmentUuid});
            done();
          }
        }
      });
      UserController.deleteAppointment(requestMock, replyMock);
    });
  });

  describe('getPatientsForDoctor', () => {
    let requestMock, replyMock, mockResult;
    beforeEach(() => {
      requestMock = {
        params: {
          doctorId: '123'
        }
      };
      mockResult = {
        users: [{}]
      };
    });

    it('should reply with an error if UserService.getPatientsForDoctor returns an error', (done) => {
      UserServiceMock.getPatientsForDoctor.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith('error');
            done();
          }
        }
      });
      UserController.getPatientsForDoctor(requestMock, replyMock);
    });

    it('should reply with a normal response if everything succeeds', (done) => {
      UserServiceMock.getPatientsForDoctor.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(UtilsMock.createResponseData).toHaveBeenCalledWith(ResponsesMock.nodetraining200, mockResult.users);
            done();
          }
        }
      });
      UserController.getPatientsForDoctor(requestMock, replyMock);
    });
  });

  describe('getPatients', () => {
    let requestMock, replyMock, mockResult;
    beforeEach(() => {
      requestMock = {};
      mockResult = {
        users: [{}]
      };
    });

    it('should reply with an error if UserService.getPatients returns an error', (done) => {
      UserServiceMock.getPatients.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith('error');
            done();
          }
        }
      });
      UserController.getPatients(requestMock, replyMock);
    });

    it('should reply with a normal response if everything succeeds', (done) => {
      UserServiceMock.getPatients.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(UtilsMock.createResponseData).toHaveBeenCalledWith(ResponsesMock.nodetraining200, mockResult.users);
            done();
          }
        }
      });
      UserController.getPatients(requestMock, replyMock);
    });
  });

  describe('getDoctors', () => {
    let requestMock, replyMock, mockResult;
    beforeEach(() => {
      requestMock = {};
      mockResult = {
        users: [{}]
      };
    });

    it('should reply with an error if UserService.getDoctors returns an error', (done) => {
      UserServiceMock.getDoctors.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(ErrorsMock.createGeneralError).toHaveBeenCalledWith('error');
            done();
          }
        }
      });
      UserController.getDoctors(requestMock, replyMock);
    });

    it('should reply with a normal response if everything succeeds', (done) => {
      UserServiceMock.getDoctors.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      replyMock = jasmine.createSpy('reply').and.callFake(() => {
        return {
          code: function (statusCode) {
            expect(UtilsMock.createResponseData).toHaveBeenCalledWith(ResponsesMock.nodetraining200, mockResult.users);
            done();
          }
        }
      });
      UserController.getDoctors(requestMock, replyMock);
    });
  });
});

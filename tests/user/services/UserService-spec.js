'use strict';

const rewire = require('rewire');

describe('UserService functions', function () {

  let UserService, UtilsMock, ResponsesMock, PatientModelMock, DoctorModelMock, AppointmentModelMock, MongoServiceMock;
  let mockModel;

  beforeEach(() => {
    UserService = rewire('../../../server/api/user/services/UserService.js');

    UtilsMock = {
      log: jasmine.createSpy('log')
    };
    ResponsesMock = {
      nodetraining409: 'nodetraining409',
      nodetraining400: 'nodetraining400'
    };
    mockModel = {
      email: 'foo.email'
    };
    PatientModelMock = jasmine.createSpy('PatientModel').and.returnValue(mockModel);
    DoctorModelMock = jasmine.createSpy('DoctorModel').and.returnValue(mockModel);
    AppointmentModelMock = jasmine.createSpy('AppointmentModel');
    MongoServiceMock = {
      findOne: jasmine.createSpy('findOne'),
      findAndModify: jasmine.createSpy('findAndModify'),
      find: jasmine.createSpy('find')
    };

    UserService.__set__('Utils', UtilsMock);
    UserService.__set__('log', UtilsMock.log);
    UserService.__set__('Responses', ResponsesMock);
    UserService.__set__('PatientModel', PatientModelMock);
    UserService.__set__('DoctorModel', DoctorModelMock);
    UserService.__set__('AppointmentModel', AppointmentModelMock);
    UserService.__set__('MongoService', MongoServiceMock);
  });

  it('should be defined on initialization', () => {
    expect(UserService).toBeDefined();
  });

  describe('addUser', () => {
    let mockData, mockResult;
    beforeEach(() => {
      mockData = {
        logData: 'logData',
        payload: {
          isDoctor: true
        }
      };
      mockResult = {
        uuid: '123'
      };
    });

    it('should call DoctorModel if payload.isDoctor is true and reject promise if MongoService.findOne fails', (done) => {
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'doctors',
          query: { email: mockModel.email }
        }
      });
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.addUser(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        expect(MongoServiceMock.findOne).toHaveBeenCalledWith(expectedInput);
        expect(DoctorModelMock).toHaveBeenCalled();
        done();
      });
    });

    it('should call PatientModel if payload.isDoctor is false and reject promise if MongoService.findOne fails', (done) => {
      mockData.payload.isDoctor = false;
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'patients',
          query: { email: mockModel.email }
        }
      });
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.addUser(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        expect(MongoServiceMock.findOne).toHaveBeenCalledWith(expectedInput);
        expect(PatientModelMock).toHaveBeenCalled();
        done();
      });
    });

    it('should call PatientModel if payload.isDoctor is false and reject promise if MongoService.findOne returns a user (user already exists case)', (done) => {
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve({uuid: '123'});
        });
      });

      UserService.addUser(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(ResponsesMock.nodetraining409);
        done();
      });
    });

    it('should call DoctorModel if payload.isDoctor is true and reject promise if MongoService.findAndModify fails', (done) => {
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'doctors',
          query: { email: mockModel.email },
          data: mockModel,
          options: { upsert: true, new: true }
        }
      });
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        });
      });

      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.addUser(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        expect(MongoServiceMock.findAndModify).toHaveBeenCalledWith(expectedInput);
        done();
      });
    });

    it('should call PatientModel if payload.isDoctor is false and reject promise if MongoService.findAndModify fails', (done) => {
      mockData.payload.isDoctor = false;
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'patients',
          query: { email: mockModel.email },
          data: mockModel,
          options: { upsert: true, new: true }
        }
      });
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        });
      });

      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.addUser(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        expect(MongoServiceMock.findAndModify).toHaveBeenCalledWith(expectedInput);
        done();
      });
    });

    it('should call DoctorModel if payload.isDoctor is true and resolve promise if MongoService.findAndModify does not fail', (done) => {
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(undefined);
        });
      });

      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      UserService.addUser(mockData)
      .then((result) => {
        expect(result).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been rejected');
      });
    });
  });

  describe('addAppointmentToPatient', () => {
    let mockData, mockResult;
    beforeEach(() => {
      mockData = {
        logData: 'logData',
        payload: {},
        params: {
          userUuid: '123'
        }
      };
      mockResult = {
        uuid: '123'
      };
    });

    it('should reject promise if MongoService.findAndModify fails', (done) => {
      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.addAppointmentToPatient(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        done();
      });
    });

    it('should resolve promise if MongoService.findAndModify does not fail', (done) => {
      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      UserService.addAppointmentToPatient(mockData)
      .then((result) => {
        expect(result).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been resolved');
      });
    });
  });

  describe('deleteAppointment', () => {
    let mockData, mockResult;
    beforeEach(() => {
      mockData = {
        logData: 'logData',
        params: {
          userUuid: '123',
          appointmentUuid: '456'
        }
      };
      mockResult = {
        uuid: '123'
      };
    });

    it('should reject promise if MongoService.findOne returns a null result', (done) => {
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(null);
        });
      });

      UserService.deleteAppointment(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual(ResponsesMock.nodetraining400);
        done();
      });
    });

    it('should reject promise if MongoService.findAndModify fails', (done) => {
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve({uuid: '123'});
        });
      });
      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.deleteAppointment(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        done();
      });
    });

    it('should resolve promise if MongoService.findAndModify does not fail', (done) => {
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'patients',
          query: { uuid: mockData.params.userUuid },
          data: { $pull: { appointments: { uuid: mockData.params.appointmentUuid } } },
          options: { new: true }
        }
      });
      MongoServiceMock.findOne.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve({uuid: '123'});
        });
      });
      MongoServiceMock.findAndModify.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      UserService.deleteAppointment(mockData)
      .then((result) => {
        expect(MongoServiceMock.findAndModify).toHaveBeenCalledWith(expectedInput);
        expect(result).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been resolved');
      });
    });
  });

  describe('getPatients', () => {
    let mockData, mockResult;
    beforeEach(() => {
      mockData = {
        logData: 'logData',
        params: {
          userUuid: '123',
          appointmentUuid: '456'
        }
      };
      mockResult = [{uuid:'123456'}];
    });

    it('should reject promise if MongoService.find fails', (done) => {
      MongoServiceMock.find.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.getPatients(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        done();
      });
    });

    it('should resolve promise if MongoService.find does not fail', (done) => {
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'patients',
          query: { },
          options: { sort: { email: 1} }
        }
      });
      MongoServiceMock.find.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      UserService.getPatients(mockData)
      .then((result) => {
        expect(MongoServiceMock.find).toHaveBeenCalledWith(expectedInput);
        expect(result.users).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been resolved');
      });
    });
  });

  describe('getPatientsForDoctor', () => {
    let mockData, mockResult;
    beforeEach(() => {
      mockData = {
        logData: 'logData',
        params: {
          doctorUuid: '123'
        }
      };
      mockResult = [{uuid:'123456'}];
    });

    it('should reject promise if MongoService.find fails', (done) => {
      MongoServiceMock.find.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.getPatientsForDoctor(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        done();
      });
    });

    it('should resolve promise if MongoService.find does not fail', (done) => {
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'patients',
          query: { 'appointments.doctorId': mockData.params.doctorUuid },
          options: { sort: { email: 1} }
        }
      });
      MongoServiceMock.find.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      UserService.getPatientsForDoctor(mockData)
      .then((result) => {
        expect(MongoServiceMock.find).toHaveBeenCalledWith(expectedInput);
        expect(result.users).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been resolved');
      });
    });
  });

  describe('getDoctors', () => {
    let mockData, mockResult;
    beforeEach(() => {
      mockData = {
        logData: 'logData',
        params: {
          doctorUuid: '123'
        }
      };
      mockResult = [{uuid:'123456'}];
    });

    it('should reject promise if MongoService.find fails', (done) => {
      MongoServiceMock.find.and.callFake(() => {
        return new Promise((resolve, reject) => {
          reject('error');
        });
      });

      UserService.getDoctors(mockData)
      .then((result) => {
        done.fail('Promise should not have been resolved');
      })
      .catch((error) => {
        expect(error).toEqual('error');
        done();
      });
    });

    it('should resolve promise if MongoService.find does not fail', (done) => {
      let expectedInput = Object.assign(mockData, {
        query: {
          collection: 'doctors',
          query: {},
          options: { sort: { email: 1} }
        }
      });
      MongoServiceMock.find.and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve(mockResult);
        });
      });

      UserService.getDoctors(mockData)
      .then((result) => {
        expect(MongoServiceMock.find).toHaveBeenCalledWith(expectedInput);
        expect(result.users).toEqual(mockResult);
        done();
      })
      .catch((error) => {
        done.fail('Promise should not have been resolved');
      });
    });
  });
});

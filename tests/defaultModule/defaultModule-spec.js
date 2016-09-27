var rewire = require("rewire");

describe('defaultModule check', function () {

	var defaultModule = rewire('../../server/api/defaultModule/defaultModuleController.js');

	it('should be true', function () {
    expect(1).toBe(1);
	});
});

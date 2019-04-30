var assert = require('assert');
var openerr = require('../index')

describe('Openerr', function() {
    describe('#test()', function() {
      it('should print out test string', function() {
        assert.equal(openerr.test("test"), "test");
      });
    });
  });
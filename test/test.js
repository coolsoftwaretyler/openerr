var assert = require('assert');
var openerr = require('../index')
var correctOpenStatesQuery = `
{ 
    search: bills(first:100, after:"xxx6969xxx", jurisdiction: "Colorado", actionSince: "2019-04-20") {
        edges {
            node {
                id,
                title,
                identifier,
                openstatesUrl,
                actions {
                    description
                    date
                }
            }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
        }
    }
}
`
describe('Openerr', function() {
    describe('#test()', function() {
      it('should print out test string', function() {
        assert.equal(openerr.test("test"), "test");
      });
    });
    describe('#createOpenStatesQuery()', function() {
        it('should create the Open States query as expected', function() {
            // Use `.raw` to compare raw strings.
          assert.equal(openerr.testCreateOpenStatesQuery('2019-04-20', 'xxx6969xxx'), correctOpenStatesQuery.raw)
        });
      });
  });
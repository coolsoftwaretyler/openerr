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
var sampleBillData = {
    node : {
        identifier: 'xxx-xxx-xxx',
        title: 'Correct bill object',
        actions : [
            {
                description: 'Latest action taken',
                date: '2019-04-20T04:20:00'
            }
        ],
        openstatesUrl: 'https://openstates.org'
    }
}

var correctBillObject = {
    identifier: 'xxx-xxx-xxx',
    title: 'Correct bill object',
    latestAction: 'Latest action taken',
    latestActionDate: '2019-04-20',
    openstatesUrl: 'https://openstates.org'
}

describe('Openerr', function() {
    describe('#createOpenStatesQuery()', function() {
        it('should create the Open States query as expected', function() {
            // Use `.raw` to compare raw strings.
          assert.equal(openerr.testCreateOpenStatesQuery('2019-04-20', 'xxx6969xxx'), correctOpenStatesQuery.raw)
        });
      });
      describe('#createBillObject()', function() {
        it('should create bill objects as expected', function() {
          assert.equal(openerr.testCreateBillObject(sampleBillData).identifier, correctBillObject.identifier)
          assert.equal(openerr.testCreateBillObject(sampleBillData).title, correctBillObject.title)
          assert.equal(openerr.testCreateBillObject(sampleBillData).latestAction, correctBillObject.latestAction)
          assert.equal(openerr.testCreateBillObject(sampleBillData).latestActionDate, correctBillObject.latestActionDate)
          assert.equal(openerr.testCreateBillObject(sampleBillData).openstatesUrl, correctBillObject.openstatesUrl)
        });
      });
      describe('#startTweeting()', function() {
        it('should return false when bills are empty', function() {
            // We should receive an email about this as well
            assert.equal(openerr.testStartTweeting([]), false)
        });
        it('should return the bills when they are present', function() {
            assert.equal(openerr.testStartTweeting([correctBillObject]).length, 1)
        });
      });
  });
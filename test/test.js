var assert = require('assert');
var openerr = require('../index');
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
`;
var sampleBillData = {
  node: {
    identifier: 'xxx-xxx-xxx',
    title: 'Correct bill object',
    actions: [
      {
        description: 'Latest action taken',
        date: '2019-04-20T04:20:00',
      },
    ],
    openstatesUrl: 'https://openstates.org',
  },
};
var correctBillObject = {
  identifier: 'xxx-xxx-xxx',
  title: 'Correct bill object',
  latestAction: 'Latest action taken',
  latestActionDate: '2019-04-20',
  openstatesUrl: 'https://openstates.org',
};

var shortBill = {
  identifier: '',
  title: '',
  latestActionDate: '',
  latestAction: '',
  openstatesUrl: '',
};

var truncatedBill = {
  identifier: '',
  title: '',
  latestActionDate: '',
  latestAction: '',
  openstatesUrl:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.',
};

var longBill = {
  identifier: 'xxx-xxx-xxx',
  title:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.',
  latestActionDate: '',
  latestAction: '',
  openstatesUrl:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.',
};

var correctFullTweet = 'Colorado : . On , the following action was taken: .';

var correctTruncatedTweet =
  'Colorado : . On , the following action was taken: .';

var correctDefaultTweet =
  'There was action on Colorado xxx-xxx-xxx, but it was too long to tweet.';

describe('Openerr', function() {
  describe('#createOpenStatesQuery()', function() {
    it('should create the Open States query as expected', function() {
      // Use `.raw` to compare raw strings.
      assert.equal(
        openerr.testCreateOpenStatesQuery('2019-04-20', 'xxx6969xxx'),
        correctOpenStatesQuery.raw
      );
    });
  });
  describe('#createBillObject()', function() {
    it('should create bill objects as expected', function() {
      assert.equal(
        openerr.testCreateBillObject(sampleBillData).identifier,
        correctBillObject.identifier
      );
      assert.equal(
        openerr.testCreateBillObject(sampleBillData).title,
        correctBillObject.title
      );
      assert.equal(
        openerr.testCreateBillObject(sampleBillData).latestAction,
        correctBillObject.latestAction
      );
      assert.equal(
        openerr.testCreateBillObject(sampleBillData).latestActionDate,
        correctBillObject.latestActionDate
      );
      assert.equal(
        openerr.testCreateBillObject(sampleBillData).openstatesUrl,
        correctBillObject.openstatesUrl
      );
    });
  });
  describe('#startTweeting()', function() {
    it('should return false when bills are empty', function() {
      assert.equal(openerr.testStartTweeting([]), false);
    });
    it('should return the bills when they are present', function() {
      assert.equal(openerr.testStartTweeting([correctBillObject]).length, 1);
    });
    it('should return with a too many bills message if there are 600+', function() {
      var tooManyBills = [];
      for (i = 0; i < 700; i++) {
        tooManyBills.push(correctBillObject);
      }
      assert.equal(openerr.testStartTweeting(tooManyBills).length, 700);
    });
  });
  describe('#createTweetText()', function() {
    it('should return full tweet if length < 280', function() {
      assert.equal(
        openerr.testCreateTweetText(shortBill).raw,
        correctFullTweet.raw
      );
    });
    it('should return tweetBody if tweetbody + readMore > 280 && tweetBody < 280', function() {
      assert.equal(
        openerr.testCreateTweetText(truncatedBill).raw,
        correctTruncatedTweet.raw
      );
    });
    it('should return default message if tweetBody > 280', function() {
      assert.equal(
        openerr.testCreateTweetText(longBill).raw,
        correctDefaultTweet.raw
      );
    });
  });
});

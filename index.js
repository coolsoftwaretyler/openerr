// Load dependencies
const secrets = require('./secrets.json');
var https = require('https');
var Twitter = require('twitter');
// Set up constants and variables
const url = 'openstates.org';
var env = 'test';
var twitter = new Twitter({
  consumer_key: secrets.api_key,
  consumer_secret: secrets.api_secret_key,
  access_token_key: secrets.access_token,
  access_token_secret: secrets.access_token_secret,
});
var d = new Date();
d.setDate(d.getDate() - 1);
var date = d.toISOString().split('T')[0];
var openStatesQuery = createOpenStatesQuery(date);

function getIt(query, bills) {
  var options = {
    headers: {'X-API-KEY': secrets.openStatesKey},
    host: url,
    path: `/graphql/?query=${query}`,
  };
  var req = https.get(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res
      .on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      })
      .on('end', function() {
        var body = Buffer.concat(bodyChunks);
        var parsedBody = JSON.parse(body);
        var hasNextPage = parsedBody.data.search.pageInfo.hasNextPage;
        var endCursor = parsedBody.data.search.pageInfo.endCursor;
        var responseData = parsedBody.data.search.edges;
        for (i = 0; i < responseData.length; i++) {
          bill = createBillObject(responseData[i]);
          bills.push(bill);
        }
        if (hasNextPage) {
          var newQuery = createOpenStatesQuery(date, endCursor);
          getIt(newQuery, bills);
        } else {
          startTweeting(bills);
        }
      });
  });
  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
  });
}

// Tweet out the results
function startTweeting(bills, testing = false) {
  if (bills.length === 0) {
    console.log('No bills found today');
    return false;
  } else {
    for (i = 0; i < bills.length; i++) {
      var readMore = bills[i].openstatesUrl
        ? 'Read more at: ' + bills[i].openstatesUrl.toString()
        : '';
      var tweetText = `Colorado ${bills[i].identifier}: ${bills[i].title}. On ${
        bills[i].latestActionDate
      }, the following action was taken: ${bills[i].latestAction}. ${readMore}`;
      if (testing) {
        return bills;
      } else {
        tweet(tweetText);
      }
    }
  }
}

function tweet(status) {
  if (env === 'production') {
    twitter
      .post('statuses/update', {status: status})
      .then(function(tweet) {
        console.log(tweet);
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    console.log(status);
  }
}

// Open States Query constructor
function createOpenStatesQuery(date, cursor = null) {
  var query = `
        {
            search: bills(first:100, after:"${
              cursor ? cursor : ''
            }", jurisdiction: "Colorado", actionSince: "${date}") {
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
  return encodeURIComponent(query);
}

// Bill object constructor
function createBillObject(data) {
  bill = {
    identifier: data.node.identifier,
    title: data.node.title,
    latestAction: data.node.actions[0].description,
    latestActionDate: data.node.actions[0].date.split('T')[0],
    openstatesUrl: data.node.openstatesUrl,
  };
  return bill;
}

// AWS Lambda handler
exports.handler = function(event, context, callback) {
  console.log(event);
  console.log(context);
  env = 'production';
  getIt(url, openStatesQuery, []);
  callback(null, 'Success from lambda');
};

// Test exports

// Check that open states queries get created correctly
exports.testCreateOpenStatesQuery = function(date, cursor) {
  return createOpenStatesQuery(date, cursor).raw;
};

// Check that bill objects get created correctly
exports.testCreateBillObject = function(data) {
  return createBillObject(data);
};

// Check that startTweeting works
exports.testStartTweeting = function(bills) {
  return startTweeting(bills, true);
};

// If we said to run it local, run it.
if (process.argv[2] === 'local') {
  // getIt(url, openStatesQuery, []);
  getIt(openStatesQuery, []);
}

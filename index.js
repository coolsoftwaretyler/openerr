// Load dependencies 
const axios = require('axios');
const secrets = require("./secrets.json");
var Twitter = require('twitter');
// Set up constants and variables 
const url = "https://openstates.org/graphql";
var env = 'test';
var twitter = new Twitter({
    consumer_key: secrets.api_key,
    consumer_secret: secrets.api_secret_key,
    access_token_key: secrets.access_token,
    access_token_secret: secrets.access_token_secret
});
var d = new Date();
d.setDate(d.getDate() - 1);
var date = d.toISOString().split('T')[0];
var openStatesQuery = createOpenStatesQuery(date);
function getIt(url, query, bills) {
    axios.get(url, { params: { query: query }, headers: { 'X-API-KEY': secrets.openStatesKey } })
        .then(function (response) {
            var hasNextPage = response.data.data.search.pageInfo.hasNextPage;
            var endCursor = response.data.data.search.pageInfo.endCursor;
            if (hasNextPage) {
                var responseData = response.data.data.search.edges;
                for (i = 0;i < responseData.length;i++) {
                    bill = createBillObject(responseData[i]);
                    bills.push(bill);
                }
                var newQuery = createOpenStatesQuery(date, endCursor);
                getIt(url, newQuery, bills);
            } else {
                var responseData = response.data.data.search.edges;
                for (i = 0;i < responseData.length;i++) {
                    bill = createBillObject(responseData[i]);
                    bills.push(bill);
                }
                startTweeting(bills);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Tweet out the results 
function startTweeting(bills, testing = false) {
    if (bills.length === 0) {
        var send = require('gmail-send')({
            user: secrets.gmail_user,
            pass: secrets.gmail_password,
            to: 'tyler@ogdenstudios.xyz',
            subject: 'No bills posted today',
            text: 'CO Openerr found no bills to tweet',
        })({});
        return false;
    } else {
        for (i = 0;i < bills.length;i++) {
            var readMore = bills[i].openstatesUrl ? "Read more at: " + bills[i].openstatesUrl.toString() : '';
            var tweetText = `Colorado ${bills[i].identifier}: ${bills[i].title}. On ${bills[i].latestActionDate}, the following action was taken: ${bills[i].latestAction}. ${readMore}`;
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
        // twitter.post('statuses/update', { status: status })
        //     .then(function (tweet) {
        //         console.log(tweet);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        console.log("whoops, we sent tweets");
    } else {
        console.log("Good job, we didn't send the tweets");
        //console.log(status);
    }
}

// Open States Query constructor 
function createOpenStatesQuery(date, cursor = null) {
    var query = `
        { 
            search: bills(first:100, after:"${cursor ? cursor : ''}", jurisdiction: "Colorado", actionSince: "${date}") {
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
    return query;
}

// Bill object constructor 
function createBillObject(data) {
    bill = {
        identifier: data.node.identifier,
        title: data.node.title,
        latestAction: data.node.actions[0].description,
        latestActionDate: data.node.actions[0].date.split("T")[0],
        openstatesUrl: data.node.openstatesUrl
    }
    return bill;
}

// AWS Lambda handler 
exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(context);
    getIt(url, openStatesQuery, []);
    callback(null, "Success from lambda");
}

// Test exports 

// Check that open states queries get created correctly
exports.testCreateOpenStatesQuery = function (date, cursor) {
    return createOpenStatesQuery(date, cursor).raw;
}

// Check that bill objects get created correctly 
exports.testCreateBillObject = function (data) {
    return createBillObject(data);
}

// Check that startTweeting works 
exports.testStartTweeting = function (bills) {
    return startTweeting(bills, true);
}

// If we said to run it local, run it. 
if (process.argv[2] === 'local'){
    getIt(url, openStatesQuery, []);
}
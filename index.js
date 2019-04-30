// Load dependencies 
const axios = require('axios');
const secrets = require("./secrets.json");
var Twitter = require('twitter');
// Set up constants and variables 
const url = "https://openstates.org/graphql";
var today = new Date();
bills = []
var twitter = new Twitter({
    consumer_key: secrets.api_key,
    consumer_secret: secrets.api_secret_key,
    access_token_key: secrets.access_token,
    access_token_secret: secrets.access_token_secret
});
var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + (today.getDate() - 1);
var openStatesQuery = createOpenStatesQuery(date);

function getIt(url, query) {
    axios.get(url, { params: { query: query }, headers: { 'X-API-KEY': secrets.openStatesKey } })
        .then(function (response) {
            var hasNextPage = response.data.data.search.pageInfo.hasNextPage;
            var endCursor = response.data.data.search.pageInfo.endCursor;
            if (hasNextPage) {
                var responseData = response.data.data.search.edges;
                for (i = 0;i < responseData.length;i++) {
                    bill = constructBillObject(responseData[i]);
                    bills.push(bill);
                }
                var newQuery = createOpenStatesQuery(date, endCursor);
                getIt(url, newQuery);
            } else {
                var responseData = response.data.data.search.edges;
                for (i = 0;i < responseData.length;i++) {
                    bill = constructBillObject(responseData[i]);
                    bills.push(bill);
                }
                startTweeting();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Tweet out the results 
function startTweeting() {
    if (bills.length === 0) {
        var send = require('gmail-send')({
            user: secrets.gmail_user,
            pass: secrets.gmail_password,
            to: 'tyler@ogdenstudios.xyz',
            subject: 'No bills posted today',
            text: 'CO Openerr found no bills to tweet',
        })({});
    } else {
        console.log("Got bills");
        for (i = 0;i < bills.length;i++) {
            var readMore = bills[i].openstatesURL ? "Read more at: " + bills[i].openstatesURL.toString() : '';
            var tweetText = `Colorado ${bills[i].identifier}: ${bills[i].title}. On ${bills[i].latestActionDate}, the following action was taken: ${bills[i].latestAction}. ${readMore}`;
            tweet(tweetText);
        }
    }
}

function tweet(status) {
    twitter.post('statuses/update', { status: status })
        .then(function (tweet) {
            console.log(tweet);
        })
        .catch(function (error) {
            console.log(error);
        });
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
function constructBillObject(data) {
    bill = {
        identifier: data.node.identifier,
        title: data.node.title,
        latestAction: data.node.actions[0].description,
        latestActionDate: data.node.actions[0].date.split("T")[0],
        openstatesURL: data.node.openstatesUrl
    }
    return bill;
}

// AWS Lambda handler 
exports.handler = function (event, context, callback) {
    getIt(url, openStatesQuery);
    callback(null, "Success from lambda");
}

// Test handler 
exports.test = function(text){
    return text
}

// Check that open states queries get made correctly
exports.testCreateOpenStatesQuery = function(date, cursor) {
    return createOpenStatesQuery(date, cursor).raw;
}
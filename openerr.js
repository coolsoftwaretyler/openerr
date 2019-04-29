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

// For testing purposes. TODO: make sure we use the correct date
var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + (today.getDate() - 3);
// TODO: use this one for the date.
//var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
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

getIt(url, openStatesQuery);

// Tweet out the results 
function startTweeting() {
    if (bills.length === 0) {
        tweet("We didn't find any bill activity for yesterday. If you think this is an error, please DM us! For more information about the CO legislature, visit: https://leg.colorado.gov/");
    } else {
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
            throw error;
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
// Load dependencies 
const axios = require('axios');
const secrets = require("./secrets.json");

// Set up constants and variables 
const url = "https://openstates.org/graphql";
var today = new Date();
bills = []
// For testing purposes. TODO: make sure we use the correct date
var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + (today.getDate() - 8);
// TODO: use this one for the date.
// var date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
var openStatesQuery = createOpenStatesQuery(date);
// Set the API Key header for all requests
axios.defaults.headers.common['X-API-KEY'] = secrets.openStatesKey;

// Check how many bills meet the criteria 
function getIt(url, query) {
    axios.get(url, { params: { query: query } })
        .then(function (response) {
            var hasNextPage = response.data.data.search.pageInfo.hasNextPage;
            var endCursor = response.data.data.search.pageInfo.endCursor;
            if (hasNextPage){
                console.log("there's another page at " + endCursor.toString());
                var responseData = response.data.data.search.edges;
                for (i=0; i<responseData.length; i++) {
                    bills.push(responseData[i]);
                }
                var newQuery = createOpenStatesQuery(date, endCursor);
                getIt(url, newQuery);
            } else {
                console.log("no more new pages");
                var responseData = data.data.search.edges;
                for (i=0; i<responseData.length; i++) {
                    bills.push(responseData[i]);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

getIt(url, openStatesQuery);

// Tweet about it 
// TODO: tweet logic to avoid ratelimiting

// Open States Query constructor 

function createOpenStatesQuery(date, cursor = null) {
    var query = `
        { 
            search: bills(first:100, after:"${cursor ? cursor : ''}", jurisdiction: "Colorado", actionSince: "${date}") {
                edges {
                    node {
                        id,
                        title,
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
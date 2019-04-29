// Load dependencies 
const axios = require('axios');
const secrets = require("./secrets.json");

// Set up constants and variables 
const url = "https://openstates.org/graphql";
var today = new Date();
// For testing purposes. TODO: make sure we use the correct date
var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + (today.getDate() - 8);
// TODO: use this one for the date.
// var date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
var openStatesQuery = '{search: bills(first: 100, jurisdiction: "Colorado", actionSince: "' + date + '") {totalCount, edges {node {id, title, actions{description, date}}}}}'

// Set the API Key header for all requests
axios.defaults.headers.common['X-API-KEY'] = secrets.openStatesKey;

// Check how many bills meet the criteria 
function getTotalCount() {
    axios.get(url, { params: { query: openStatesQuery } })
        .then(function (response) {
            totalCount = response.data.data.search.totalCount;
            pageResults(totalCount, response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function pageResults(count, response){
    // Set up an object to hold those bills 
    var bills = {};
    // Page through all the bills that meet the criteria 
    // Push the title, bill identifier, open states ID, action title and action date into the object
    console.log(count);
    console.log(response);
}

getTotalCount();

// Tweet about it 
// TODO: tweet logic to avoid ratelimiting

async function getIt() {
    try {
        const response = await axios.get(url, { params: { query: openStatesQuery } });
        process(response.data);
    } catch (error) {
        console.error(error);
    }
}

//getIt();

function process(data) {
    totalCount = data.data.search.totalCount;
    console.log(totalCount);
    responseData = data.data.search.edges;
    for (i = 0;i < responseData.length;i++) {
        var title = responseData[i].node.title;
        // console.log(title);
        var actions = responseData[i].node.actions;
        for (j = 0;j < actions.length;j++) {
            // console.log(actions[j]);
        }
    }
}
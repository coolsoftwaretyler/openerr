// Load dependencies and set up constants 
const axios = require('axios');
const secrets = require("./secrets.json");
const url = "https://openstates.org/graphql";

var osq = '{search: bills(first: 100, jurisdiction: "Colorado") {edges {node {id}}}}'
// Set the API Key header for all requests
axios.defaults.headers.common['X-API-KEY'] = secrets.openStatesKey;

async function getIt() {
    try {
        const response = await axios.get(url, {params: { query: osq }});
        console.log("success!");
        console.log(response.data);
    } catch (error) {
        console.log("error :(");
        console.error(error);
    }
}

getIt();
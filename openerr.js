console.log("Openerr");
//var url = 'https://openstates.org/graphql'
// headers = { "X-API-KEY" => Rails.application.credentials.open_states_api_key, "Content-type" => "application/json" }
// body = {query: "{bill(id : \"#{self.bill_id}\") { updatedAt }}" }.to_json

const https = require("https");
const url = "https://jsonplaceholder.typicode.com/posts/1";
https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(body);
  });
});
# Colorado Openerr 

[Colorado Openerr](https://twitter.com/openerr_co) uses the [Open States API](https://openstates.org/) to tweet about what is happening in Colorado state legislation. 

Built by [Ogden Studios](https://ogdenstudios.xyz). The best way to support this project is by giving money to [Open States](https://openstates.org/). 

## Secrets 

You'll need your own Open States API key, Twitter API credentials, and Gmail credentials to run the script correctly. If you're interested in collaborating. If you want to contribute to the project but can't get those credentials, let me know and we can figure something out. 

## Tests 

If you run `npm test`, you'll run the test suite built with [Mocha](https://mochajs.org/). Additionally, if you want to see the twitter output without actually hitting the Twitter API, you can run `npm run local` and instead of tweeting, the script will `console.log()` each tweet status. 

This won't be helpful in troubleshooting Twitter API issues, but it might be useful to troubleshoot any issues with the Open States API. 
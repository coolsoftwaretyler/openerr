# Colorado Openerr v0.1.0

[Colorado Openerr](https://twitter.com/openerr_co) uses the [Open States API](https://openstates.org/) to tweet about what is happening in Colorado state legislation.

Built by [Ogden Studios](https://ogdenstudios.xyz). The best way to support this project is by giving money to [Open States](https://openstates.org/).

## Secrets

You'll need your own Open States API key, Twitter API credentials, and Gmail credentials to run the script correctly. If you're interested in collaborating. If you want to contribute to the project but can't get those credentials, let me know and we can figure something out.

## Tests

If you run `npm test`, you'll run the test suite built with [Mocha](https://mochajs.org/). Additionally, if you want to see the twitter output without actually hitting the Twitter API, you can run `npm run local` and instead of tweeting, the script will `console.log()` each tweet status.

This won't be helpful in troubleshooting Twitter API issues, but it might be useful to troubleshoot any issues with the Open States API.

## Deploying to AWS Lambda

This script is meant to be packaged up and deployed to AWS Lambda. If you want to create the `.zip` file for deployment, run `npm run zip`.

## Code style

We use the `.editorconfig` and a modified `.eslintrc` from the [Node.js Style Guide](https://github.com/felixge/node-style-guide). The modified `.estlinrc` is only different in that it uses ES6.

Running `npm pretest` will also run [Prettier](https://prettier.io/) with the correct settings to meet our ESLint config. This runs before `npm test` as well.

## Versioning

We use [semantic versioning](https://semver.org/).

# Colorado Openerr v1.1.0

[Colorado Openerr](https://twitter.com/openerr_co) uses the [Open States API](https://openstates.org/) to tweet about what is happening in Colorado state legislation.

Built by [Ogden Studios](https://ogdenstudios.xyz). The best way to support this project is by giving money to [Open States](https://openstates.org/).

[Read about how and why this bot was made](https://ogdenstudios.xyz/2019/05/21/how-to-build-a-twitter-bot-with-aws-lambda.html).

## Credentials

If you plan to deploy your own version or modification of Openerr, you'll need your own [Open States API key](https://openstates.org/api/register/) and [Twitter API credentials](https://developer.twitter.com/en/docs/basics/getting-started).

## Tests

If you run `npm test`, you'll run the test suite built with [Mocha](https://mochajs.org/). Additionally, if you want to see the twitter output without actually hitting the Twitter API, you can run `npm run local` and instead of tweeting, the script will `console.log()` each tweet status.

This won't be helpful in troubleshooting Twitter API issues, but it might be useful to troubleshoot any issues with the Open States API.

## Deploying to AWS Lambda

This script is meant to be packaged up and deployed to AWS Lambda. If you want to create the `.zip` file for deployment, run `npm run zip`. Current builds are larger than 10mb and should be uploaded to an S3 bucket for lambda deployment.

## Code style

We use the `.editorconfig` and a modified `.eslintrc` from the [Node.js Style Guide](https://github.com/felixge/node-style-guide). The modified `.estlinrc` is only different in that it uses ES6. ESLint has been added to `npm run pretest`, so will fire before testing, or can be run on its own if you like.

You can run `npm run prettier` to run [Prettier](https://prettier.io/) with the correct settings to meet our ESLint config.

## Versioning

We use [semantic versioning](https://semver.org/). Check out `changelog.md` for notes about new versions as they're released.

## License

MIT Licensed. Check `LICENSE` for details.

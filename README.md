# fyp-use-case

This repo contains part of my final year project for Applied Computing.

### Setup

1. Clone the repo and run `npm i` with Node 12.
2. Run `npm run zip-win` to build the deployment package.
3. Set up an AWS Lambda function:
    1. Create a new function.
    2. Upload the deployment package (code > upload from .zip file).
    3. Set the handler to `src/index.handler` (code > runtime settings > edit).
    4. Set the timeout to 30 seconds (configuration > general configuration > edit).
4. Set up the API with API Gateway:
    1. Create a new HTTP API > Build.
    2. Create a new Lambda integration with your Lambda function.
    3. Under 'Configure routes', create a route with:
        * Method: ANY
        * Resource Path: /{proxy+}
        * Integration target: Your Lambda function name
    4. Crate the API.

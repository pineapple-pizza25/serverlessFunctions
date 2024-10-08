'use strict';

const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs({ region: 'us-east-1' });


module.exports.getLogs = async (event) => {
try {

    const logGroupName = '/aws/lambda/aws-nodejs-severless-functions-dev-createLog';

    const params = {
        logGroupName: logGroupName,
        limit: 100,  
    };

    const data = await cloudwatchlogs.filterLogEvents(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(data.events)
    };
} catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An error occurred: ' + error.message })
    };
}
};
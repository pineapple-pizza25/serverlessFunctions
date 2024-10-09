'use strict';

const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs({ region: 'us-east-1' });


module.exports.getLogs = async (event) => {
    try {

        const logGroupName = 'lambda_logs';
        const logStreamName = 'lambda_logs/stream';

        const params = {
            logGroupName: logGroupName,
            logStreamNames: [logStreamName],
            limit: 100,
        };

        const logsInStream = await cloudwatchlogs.filterLogEvents(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(logsInStream)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred: ' + error.message })
        };
    }
};
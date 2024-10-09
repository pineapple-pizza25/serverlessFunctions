'use strict';
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

/*
function to store log in cloudwatch
*/
module.exports.createLog = async (event) => {

  const cloudwatchlogs = new AWS.CloudWatchLogs();

  const describeParams =
  {
    limit: 1,
    logGroupName: "lambda_logs",
    logStreamNamePrefix: "lambda_logs"
  }

  try {
    let body;

    if (typeof event.body === "string") {
      try {
        body = JSON.parse(event.body);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        };
      }
    } else if (typeof event.body === "object") {
      body = event.body;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request, body is missing or in an incorrect format' }),
      };
    }

    if (!body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request, body is missing' }),
      };
    }

    if (!validateInput(body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request, incorrect input' }),
      };
    }

    const res = await cloudwatchlogs.describeLogStreams(describeParams).promise();
    const logStreams = res.logStreams;
    const sequenceToken = logStreams[0].uploadSequenceToken;

    const Severity = body.Severity;
    const Message = body.Message;

    if (!validateSeverity(Severity)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Severity Invalid' })
      };
    }


    /*
    the log entry will consist of a randomly generated ID, 
    the system dateTime as well as the severity and message 
    from the json body
    */
    const logEntry = {
      ID: uuidv4(),
      DateTime: new Date().toISOString(),
      Severity: Severity,
      Message: Message
    };

    const putLogParams = {
      logEvents: [{
        message: JSON.stringify(logEntry), 
        timestamp: Date.now() 
      }],
      logGroupName: "lambda_logs",
      logStreamName: "lambda_logs/stream",
      sequenceToken
    };

    const out = await cloudwatchlogs.putLogEvents(putLogParams).promise();

    return {
      statusCode: 200,
      someting: out,
      body: JSON.stringify({
        message: 'Log saved successfully',
        log: logEntry
      })
    };


  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred: ' + error.message })
    };
  }
};


/*
method used to validate if the correct Severity value has been received
*/
function validateSeverity(Severity) {
  if (Severity == "info" || Severity == "warning" || Severity == "error") {
    return true;
  }
  else {
    return false;
  }
}


/*
method used to check if the json body received is valid
*/
function validateInput(body) {
  if ('Severity' in body && 'Message' in body) {
    return true
  }
  else {
    return false
  }
}

'use strict';
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');

const cloudwatchConfig = {
  logGrogroupNameupName: process.env.CLOUDWATCH_GROUP_NAME, 
  logStreamName: 'logsCreated', 
  awsRegion: process.env.CLOUDWATCH_REGION, 
  messageFormatter: ({ level, message, additionalInfo }) => {
    return `[${level}] : ${JSON.stringify(message)} \nAdditional Info: ${JSON.stringify(additionalInfo)}`;
  },
};

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
      level: 'info',
      }),
    new WinstonCloudWatch({
      logGroupName: '/aws/lambda/aws-nodejs-severless-functions-dev-createLog',
      logStreamName: 'logsCreated',
      awsRegion: 'eu-west-3'
      }),,
  ],
});

module.exports.createLog = async (event) => {
  try {
  let body;
    
    if (typeof event.body === 'string') {
      try {
        body = JSON.parse(event.body);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        };
      }
    } else if (typeof event.body === 'object') {
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

    if (!validateInput(body)){
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request, incorrect input' }),
      };
    }

    const Severity = body.Severity;
    const Message = body.Message;

    if (!validateSeverity(Severity)){
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Severity Invalid'})
      };      
    }
    
    const logEntry = {
      ID: uuidv4(), 
      DateTime: new Date().toISOString(),  
      Severity: Severity,
      Message: Message
    };

    if (Severity == 'info') {
      logger.info('Info log', logEntry);
    } else if (Severity == 'warning') {
      logger.warn('Warning log', logEntry);
    } else if (Severity == 'error') {
      logger.error('Error log', logEntry);
    }

    return {
        statusCode: 200,
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

function validateSeverity(Severity) {
  if (Severity == "info" || Severity == "warning" || Severity == "error"){
    return true;
  }
  else{
    return false;
  }
}

function validateInput(body){
  if ('Severity' in body && 'Message' in body){
    return true
  }
  else{
    return false
  }
}

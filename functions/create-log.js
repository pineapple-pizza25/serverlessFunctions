'use strict';
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
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

    logger.log(logEntry)

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

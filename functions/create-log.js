'use strict';
const { v4: uuidv4 } = require('uuid');

let logs = [];

module.exports.createLog = async (event) => {
  try {
    const body = JSON.parse(event.body);

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

    logs.push(logEntry);

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

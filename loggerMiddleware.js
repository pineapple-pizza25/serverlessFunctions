const winston = require("winston");
const WinstonCloudWatch = require('winston-cloudwatch');

export const logger = new winston.createLogger({
    format: winston.format.json(),  
    transports: [
        new winston.transports.Console({
            timestamp: true,
            colorize: true,
            level: 'info',
        }),
    ],
});


const cloudwatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.CLOUDWATCH_REGION,
    messageFormatter: ({ level, message, additionalInfo }) => {
        console.log("----logs printed", level, message, additionalInfo)
        return `[${level}] : ${JSON.stringify(message)} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`;
    }
}
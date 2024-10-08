# AWS laambda severless functions using Nodejs

## Table of Contents
- [About the Project](#about-the-project)
- [Installation](#installation)
- [Usage](#usage)

---

## About the Project
This project was built is built to showcase the use of AWS Lambda functions using Nodejs. The app includes two basic functions that can create a log and retrieve the last 100 logs.

### Built With
- [Nodejs](https://nodejs.org/docs/latest/api/)
- [Serverless Framework](https://www.npmjs.com/package/serverless)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/)

## Features
- Create a log with unique id and date/time stamp.
- Get the last 100 logs

## Installation
```bash
# Clone the repository
git clone  https://github.com/pineapple-pizza25/serverlessFunctions.git

# Navigate to the project directory
cd <your project  directory>

# Install dependencies
npm install

#  Install the AWS cli
pip install awscli

# Install the serverless framework
npm i serverless@3.39.0 -g

# Configure your credentials
serverless config credentials --provider aws --key <AWS-Access-Key-ID> --secret <AWS-Secret-key>

# Deploy
serverless deploy

```

## Usage

### Testing the create log endpoint

Enter the following in Postman url and select the post method

```
<your-url>/createLog
```

Then input the following json

```
{
  "Severity": "info",
  "Message": "This is a test log message."
}
```

If you are testing in the AWS console use the following json to parse as an object

```
{
  "body": {
    "Severity": "info",
    "Message": "This is a test log message"
  }
}
```

### Testing the get logs endpoint

Enter the following in Postman url and select the get method

```
<your-url>/getLogs
```



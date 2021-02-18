const AWS = require('aws-sdk');
const getWateringAlerts = require('./getWateringAlerts');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Utilising the scan method to get all items in the table
    const plants = await documentClient.scan({ TableName: 'plants' }).promise();
    const watering = await documentClient
      .scan({ TableName: 'plants_watering' })
      .promise();

    const alerts = getWateringAlerts(plants.Items, watering.Items);

    const response = {
      statusCode: 200,
      body: JSON.stringify(alerts),
    };
    return response;
  } catch (e) {
    return {
      statusCode: 500,
    };
  }
};

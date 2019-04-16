const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
AWS.config.loadFromPath('./config.json');

const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/253140277330/SQS_QUEUE_NAME',
    messageAttributeNames: ['All'],
    handleMessage: async (message) => {
        //console.log('name: ', message.MessageAttributes['TicketNumber']['StringValue']);
        //console.log('authDays: ', message.MessageAttributes['AuthDays']['StringValue']);
        var name2 = message.MessageAttributes['TicketNumber']['StringValue'];
        var authDays = message.MessageAttributes['AuthDays']['StringValue'];
        //console.log('Processing message: ', message.MessageAttributes);
        //var ddd = jQuery.parseJSON(JSON.stringify(message.MessageAttributes);
       //console.log("asdfsdfsdf " + ddd);


        var request = require('request');
        request({
            url: "http://localhost:3000/api/ticketdata",
            json: true,
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: {
                name: name2,
                auth2days: authDays
            }
            }, function(error, response, body) {
           // console.log(response);
        });

    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

app.on('timeout_error', (err) => {
    console.error(err.message);
});

app.start();
const AWS = require('aws-sdk');
var temp;
var temp2;
const { Consumer } = require('sqs-consumer');
const request2 = require('request')
    ,url2 = 'http://localhost:3000/api/average';

const request = require('request')
    ,url = 'http://localhost:3000/api/total';

PubNub = require('pubnub')
AWS.config.loadFromPath('./config.json');
var pubnub = new PubNub({
    publishKey: 'pub-c-21aef803-e073-458d-8d81-eebc0185c6b8',
    subscribeKey: 'sub-c-4c0c0d12-6042-11e9-92bf-0e148eae7978'
});

var pubnub2 = new PubNub({
    publishKey: 'pub-c-3cb2e739-3463-47c0-a7bd-65b41ff2a7e8',
    subscribeKey: 'sub-c-58d9bc54-cc29-11e8-b5de-7a9ddb77e130'
});

const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/253140277330/SQS_QUEUE_NAME',
    messageAttributeNames: ['All'],
    handleMessage: async (message) => {
        console.log('name: ', message.MessageAttributes['TicketNumber']['StringValue']);
        console.log('authDays: ', message.MessageAttributes['AuthDays']['StringValue']);
        var name2 = message.MessageAttributes['TicketNumber']['StringValue'];
        var authDays5 = message.MessageAttributes['AuthDays']['StringValue'];
        //console.log('Processing message: ', message.MessageAttributes);
        //var ddd = jQuery.parseJSON(JSON.stringify(message.MessageAttributes);
       //console.log("asdfsdfsdf " + ddd);



        var request3 = require('request');
        request3({
            url: "http://localhost:3000/api/ticketdata",
            json: true,
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: {
                name: name2,
                authdays: authDays5
            }
        }, function(error, response, body) {
             console.log(response);
        });



        request(url, (error, response, body)=> {
            if (!error && response.statusCode === 200) {
                const fbResponse = JSON.parse(body)
                temp2 = fbResponse[0].createuserid
               // console.log("Got a response: ", fbResponse.authdays),
                    console.log("Got a response: ", fbResponse)
               // console.log("Got a response: ", fbResponse[0].authdays)
            } else {
                console.log("Got an error: ", error, ", status code: ", response.statusCode)
            }
        })


        pubnub.publish({
            channel: 'eon-bar',
            message: {
                eon: {
                    'data': temp2
                }
            }
        },
            function(status, response){
                if (status.error) {
                    // handle error
                    console.log(status)
                } else {
                    console.log("message Published w/ timetoken", response.timetoken)
                }
            }
        );



        request2(url2, (error, response, body)=> {
            if (!error && response.statusCode === 200) {
                const fbResponse = JSON.parse(body)
                temp = fbResponse[0].authdays
               // console.log("Got a response: ", fbResponse.authdays),
                //    console.log("Got a response: ", fbResponse)
               // console.log("Got a response: ", fbResponse[0].authdays)
            } else {
                console.log("Got an error: ", error, ", status code: ", response.statusCode)
            }
        })









        pubnub2.publish({
                channel: 'eon-gauge2',
                message: {
                    eon: {
                        'data': temp
                    }
                }
            },
            function(status, response){
                if (status.error) {
                    // handle error
                    console.log(status)
                } else {
                    console.log("message Published w/ timetoken", response.timetoken)
                }
            }
        );

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
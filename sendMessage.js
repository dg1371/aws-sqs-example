/*
   Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
   This file is licensed under the Apache License, Version 2.0 (the "License").
   You may not use this file except in compliance with the License. A copy of
   the License is located at
    http://aws.amazon.com/apache2.0/
   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied. See the License for the
   specific language governing permissions and limitations under the License.
*/

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');

// Create SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var i;

for (i=0; i < 10000; i++) {

    var params;
    params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "TicketNumber": {
                DataType: "String",
                StringValue: "The Whistler"
            },
            "Renter": {
                DataType: "String",
                StringValue: "John Grisham"
            },
            "AuthDays": {
                DataType: "Number",
                StringValue: randomIntInc(1,7)
            }
        },
        MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/253140277330/SQS_QUEUE_NAME"
    };



    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
        }
    });

}

function randomIntInc(low, high) {
   var temp = Math.floor(Math.random() * (high - low + 1) + low);
   console.log("sdfasdfsdfsafasdfsd == " + temp);
   console.log(temp.toString());

   return temp.toString();

}


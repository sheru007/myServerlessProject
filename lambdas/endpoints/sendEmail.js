const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk');
const SES =  new AWS.SES()

exports.handler = async (event) => {
    console.log({event})
    const {to, from , subject, text} = JSON.parse(event.body)

    if(!to || !from || !subject || !text){
        return Responses._400({message: "to, from , subject and text all are required int eh body"})
    }

    const params = {
        Destination: {
            ToAddresses: [ to ]
        },
        Message: {
            Body: {
                Text: { Data: text }
            },
            Subject: { Data: subject }
        },
        Source: from
    }

    try {
        await SES.sendEmail(params).promise()
        return Responses._200({message: "the email send successfully"})
    } catch (error) {
        console.log("error sending email", error)
        return Responses._400({message: "the email failed to sent"})
    }
    

}


// https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/send-email
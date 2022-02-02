const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')

const SNS = new AWS.SNS({apiVersion: '2010-03-31'})

exports.handler = async (event) => {
    console.log({event})
    
    const { phoneNumber, message} = JSON.parse(event.body)

    if(!phoneNumber || !message) {
        return Responses._400({message: 'missing phone number or message from the body'})
    }

    const AttributeParams = {
        attributes: {
            DefaultSMSType: 'Promotional'
        }
    };

    const messageParams = {
        Message: message,
        PhoneNumber: phoneNumber
    }

    try {
        await SNS.setSMSAttributes(AttributeParams).promise()
        await SNS.publish(messageParams).promise()
        return Responses._200({message: 'text message sent done'})
    } catch (error) {
        console.log("error sending text message: ", error)
        return Responses._400({message: 'the text sent failed'})
    }
}
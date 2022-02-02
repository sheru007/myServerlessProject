const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')

const SES = new AWS.SES()

exports.handler = async (event) => {
    console.log({event})

    const message = `Hey Sheru, Dont't forget to take care of your body and learning new skill`;
    const params = {
        Destination: {
            ToAddresses: ['sherutoppr@gmail.com'],
        },
        Message: {
            Body: {
                Text: { Data: message },
            },
            Subject: { Data: 'reminder email' },
        },
        Source: 'sherutoppr@gmail.com'
    }

    try {
        await SES.sendEmail(params).promise()
        return Responses._200({message: 'email sent'})
    } catch (error) {
        console.log("error while reminder email: ", error)
        return Responses._400({message: 'failed to sent email'})
    }
}
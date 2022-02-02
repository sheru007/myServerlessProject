const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk');
const Comprehend =  new AWS.Comprehend()

exports.handler = async (event) => {
    console.log({event})
    const body = JSON.parse(event.body)

    if(!body || !body.text){
        return Responses._400({message: "text are required in the body"})
    }

    const text = body.text;

    const params = {
        LanguageCode: 'en',
        TextList: [text]
    }

    try {
        const entityResults = await Comprehend.batchDetectEntities(params).promise();
        const entities = entityResults.ResultList[0]

        const sentimentResults = await Comprehend.batchDetectSentiment(params).promise()
        const sentiment = sentimentResults.ResultList[0];
        const ResponseData = {entities, sentiment}
        console.log(ResponseData)
        return Responses._200(ResponseData)
    } catch (error) {
        console.log("error working with comprehend", error)
        return Responses._400({message: "failed while work with comprehend"})
    }
    

}


// https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/analyse-text
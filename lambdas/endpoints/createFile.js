const Responses = require('../common/API_Responses')
const S3 = require('../common/S3')

const bucket = process.env.bucketName

exports.handler = async (event) => {
    console.log({event})
    if(!event.pathParameters || !event.pathParameters.fileName){
        // api failed because ID missing in path
        return Responses._400({message: 'missing the fileName from the path'})
    }

    let fileName = event.pathParameters.fileName;
    const data = JSON.parse(event.body)

    const newData = await S3.write(data, fileName, bucket).catch(err => {
        console.log('error in S3 write : ', err)
        return null;
    })
    
    if(!newData){
        return Responses._400({message: 'failed to write data by filename'})
    }

    return Responses._200({newData})
}

//https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/create-file/{fileName}
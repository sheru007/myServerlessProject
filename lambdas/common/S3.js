const AWS = require('aws-sdk')

const s3Client = new AWS.S3()

const S3 = {
    async write (data, fileName, bucket) {
        const params = {
            Bucket: bucket,
            Body: JSON.stringify(data),
            Key: fileName, 
        }

        const newData = await s3Client.putObject(params).promise()

        if(!newData) {
            throw Error('error writing the file')
        }

        return newData;
    },
    async get (fileName, bucket) {
        const params = {
            Bucket: bucket,
            Key: fileName
        }

        const data = await s3Client.getObject(params).promise()

        if(!data){
            throw Error(`error failed to get file by filename: ${fileName} from bucket: ${bucket}`)
        }

        // data is in blob
        if(fileName.slice(fileName.length - 4, fileName.length) === 'json') {
            data = data.Body.toString()
        }

        return data;
    }
}

module.exports = S3;
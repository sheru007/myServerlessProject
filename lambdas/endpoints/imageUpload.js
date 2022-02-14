import {fileTypeFromBuffer} from 'file-type';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';

const s3Client = new AWS.S3()
const Responses = require('../common/API_Responses')
const {withHooks} = require('../common/hooks')

const imageUploadBucket = process.env.imageUploadBucket
const region = process.env.region
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg']

const handler = async (event) => {
    try {
        const body = JSON.parse(event.body)

        if(!body || !body.image || !body.mime) {
            return Responses._400({message: 'missing the image or mime from the path'})
        }
        if(!allowedMimes.includes(body.mime)) {
            return Responses._400({message: 'image mime is not allowed'})
        }

        let imageData = body.image;
        if(body.image.substr(0,7) === 'base64,') {
            imageData = body.image.substr(7, body.image.length)
        }
        //converted into buffer
        const buffer = Buffer.from(imageData, 'base64')

        // convert into file
        const fileInfo = await fileTypeFromBuffer(buffer)

        const detectedExt = fileInfo.ext;
        const detectedMime = fileInfo.mime;

        if(detectedMime !== body.mime) {
            return Responses._400({message: 'image mime did not match'})
        }

        const name = uuid()
        const key = `${name}.${detectedExt}`;
        console.log("writing image to bucket called ", key)
        await s3Client.putObject({
            Body: buffer,
            Key: key,
            ContentType: body.mine,
            Bucket: imageUploadBucket,
            ACL: 'public-read'
        }).promise()

        const url = `https://${imageUploadBucket}.s3-${region}.amazonaws.com/${key}`;

        return Responses._200({imageUrl: url})
    } catch (error) {
        console.log("error in image upload::",error)
        return Responses._400({message: 'failed to upload image'})
    }
}
exports.handler = withHooks(handler)

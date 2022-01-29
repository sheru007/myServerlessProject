const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient()

const Dynamo = {
    async get (ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID
            }
        };

        const data = await documentClient.get(params).promise()

        if(!data || !data.Item){
            throw Error(`there was an error in fetching the data for ID: ${ID} of table: ${TableName}`)
        }

        console.log({data})

        return data.Item;
    },
    async write (data, TableName) {
        if(!data.ID) {
            throw Error('no ID in the data')
        }

        const params = {
            TableName,
            Item: data
        }

        const res = await documentClient.put(params).promise()

        if(!res) {
            throw Error(`error in inserting item of ID: ${data.ID} of table: ${TableName}`)
        }

        return data;
    }
};

module.exports = Dynamo
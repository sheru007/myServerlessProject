const Responses = require('../common/API_Responses')
const Dynamo = require('../common/Dynamo')

const tableName = process.env.tableName

exports.handler = async (event) => {
    console.log({event})
    if(!event.pathParameters || !event.pathParameters.ID){
        // api failed because ID missing in path
        return Responses._400({message: 'missing the ID from the path'})
    }

    let ID = event.pathParameters.ID;

    const user = await Dynamo.get(ID, tableName).catch(error => {
        console.log("error n DynamoDB get", error)
        return null;
    })

    if(!user){
        return Responses._400({message: 'failed to get user by ID'})
    }

    return Responses._200({user})
}

//https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/get-player-score/{ID}
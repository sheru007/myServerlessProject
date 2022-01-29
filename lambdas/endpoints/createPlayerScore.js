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
    const user = JSON.parse(event.body)
    user.ID = ID

    const newUser = await Dynamo.write(user,tableName).catch(err => {
        console.log('error in dynamo write : ', err)
        return null;
    })
    
    if(!newUser){
        return Responses._400({message: 'failed to write user by ID'})
    }

    return Responses._200({newUser})
}

//https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/create-player-score/{ID}
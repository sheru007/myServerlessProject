const Responses = require('../common/API_Responses')

exports.handler = async (event) => {
    console.log({event})
    if(!event.pathParameters || !event.pathParameters.ID){
        // api failed because ID missing in path
        return Responses._400({message: 'missing the ID from the path'})
    }

    let ID = event.pathParameters.ID;

    if(data[ID]) {
        //return the data
        return Responses._200(data[ID])
    }

    // failed as ID not in the data
    return Responses._400({message: 'no ID in data'})
}

const data = {
    1234: { name: "sheru", age: 25, job: 'teacher' },
    5678: { name: 'heena', age: 25, job: 'faltu'}
}

// https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/get-user/{ID}
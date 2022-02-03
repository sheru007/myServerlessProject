const Responses = require('../common/API_Responses')
const Dynamo = require('../common/Dynamo')
const {hooksWithValidation} = require('../common/hooks')
const yup = require('yup')

const tableName = process.env.tableName

const bodySchema = yup.object().shape({
    name: yup.string().required(),
    score: yup.number().required()
})

const pathSchema = yup.object().shape({
    ID: yup.string().required()
})

const handler = async (event) => {

    if(!event.pathParameters.ID){
        // api failed because ID missing in path
        return Responses._400({message: 'missing the ID from the path'})
    }

    let ID = event.pathParameters.ID;
    const user = event.body
    user.ID = ID

    const newUser = await Dynamo.write(user,tableName)
    
    if(!newUser){
        return Responses._400({message: 'failed to write user by ID'})
    }

    return Responses._200({newUser})
}

exports.handler = hooksWithValidation({bodySchema,pathSchema})(handler)
//https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/create-player-score/{ID}
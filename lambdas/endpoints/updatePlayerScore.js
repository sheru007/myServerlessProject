const Responses = require('../common/API_Responses')
const Dynamo = require('../common/Dynamo')
const {hooksWithValidation} = require('../common/hooks')
const yup = require('yup')

const tableName = process.env.tableName

const bodySchema = yup.object().shape({
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
    const {score} = event.body
    const res = await Dynamo.update({
        tableName,
        primaryKey: 'ID',
        primaryKeyValue: ID,
        updateKey: 'score',
        updateValue: score
    })
    return Responses._200({res})
}

exports.handler = hooksWithValidation({bodySchema,pathSchema})(handler)
//https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/update-player-score/
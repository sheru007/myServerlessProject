const { useHooks, logEvent, parseEvent, handleUnexpectedError } = require('lambda-hooks')

const withHooks = useHooks({
    before: [logEvent, parseEvent],
    after: [],
    onError: [handleUnexpectedError]
})
// parseEvent : already parse the event so no need of JSON.parse and event.pathParameter is already a object

const hooksWithValidation = ({bodySchema, pathSchema}) => {

    return useHooks({
        before: [logEvent, parseEvent, validateEventBody, validatePath],
        after: [],
        onError: [handleUnexpectedError]
    },{
        bodySchema,
        pathSchema
    })
}

const validateEventBody = async state => {
    const { bodySchema } = state.config;

    if(!bodySchema) {
        throw Error('missing the required body schema')
    }

    try {
        const { event } = state;
        await bodySchema.validate(event.body, { strict: true })
    } catch (error) {
        console.log('validation error of event.body : ', error)
        state.exit = true;
        state.response = { statusCode: 400, body: JSON.stringify({error: error.message}) }
    }

    return state;
}

const validatePath = async state => {
    const { pathSchema } = state.config;

    if(!pathSchema) {
        throw Error('missing the required path schema')
    }

    try {
        const { event } = state;
        await pathSchema.validate(event.pathParameters, { strict: true })
    } catch (error) {
        console.log('validation error of event.pathParameters : ', error)
        state.exit = true;
        state.response = { statusCode: 400, body: JSON.stringify({error: error.message}) }
    }

    return state;
}

module.exports = {
    withHooks,
    hooksWithValidation
}
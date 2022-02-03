const { useHooks, logEvent, parseEvent, handleUnexpectedError } = require('lambda-hooks')

const withHooks = useHooks({
    // start -->
    before: [logEvent, parseEvent],

    // lambda function is invoked now...

    after: [],
    //        Finish -->|

    onError: [handleUnexpectedError]
    // Finish if errors -->|
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

// interface State {
//     event: Event // AWS lambda event
//     context: Context // AWS lambda context
//     exit: boolean // Set to true to quit execution early
//     response?: Response // This will contain the response from your lambda after it has been executed. Also this will be returned when exit is true
//     error?: Error // If there's an unhandled exception, it will be attached here & your onError handlers will be invoked
//     config: any // Config object to provide extra things to your hooks at the point of execution e.g. you might want to pass a logger into logEvent
// }

// const logEvent = async state => {
//     console.log(`received event: ${state.event}`)

//     return state
// }

// const parseEventBody = async state => {
//     const { event } = state

//     if (typeof event.body === 'string') {
//         state.event.body = JSON.parse(event.body)
//     }

//     return state
// }

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
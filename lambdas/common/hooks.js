const { useHooks, logEvent, parseEvent, handleUnexpectedError } = require('lambda-hooks')

const withHooks = useHooks({
    before: [logEvent, parseEvent],
    after: [],
    onError: [handleUnexpectedError]
})
// parseEvent : already parse the event so no need of JSON.parse and event.pathParameter is already a object

module.exports = {
    withHooks
}
const Responses = require('../common/API_Responses')
const Dynamo = require('../common/Dynamo')
const {withHooks} = require('../common/hooks')

const tableName = process.env.tableName

const handler = async (event) => {
    if(!event.pathParameters.game){
        // api failed because game missing in path
        return Responses._400({message: 'missing the game from the path'})
    }

    let game = event.pathParameters.game;

    const gamePlayer = await Dynamo.query({
        tableName,
        index: 'game-index',
        queryKey: 'game',
        queryValue: game
    })
    return Responses._200({gamePlayer})
}
exports.handler = withHooks(handler)
//https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/get-game-scores/
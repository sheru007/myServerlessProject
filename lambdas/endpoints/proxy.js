const Responses = require('../common/API_Responses')

exports.handler = async (event) => {
    console.log({event})
    
    return Responses._200()
}

// https://dv5fwk1589.execute-api.us-east-1.amazonaws.com/dev/sk-proxy-api/{proxy+}
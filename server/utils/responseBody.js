function getResponse(statusCode = null, status = "", message = "", response = {}) {
    return {
        statusCode: statusCode,
        status: status,
        response: response,
        message: message
    }
}

module.exports = getResponse
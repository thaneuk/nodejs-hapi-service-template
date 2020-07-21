'use strict';


/**
 * JavaScript Error to support response error properties
 */
class ResponseError extends Error {
    constructor(message, {statusCode = 500, body = null, headers = null, request = null, response = null, error = null}) {
        super(message);

        this.name = 'ResponseError';

        this.headers = headers;
        this.statusCode = statusCode;
        this.responseBody = body;
        this.request = request;
        this.response = response;

        if (error) {
            this.innerError = error;
        }
    }
}


module.exports = ResponseError;

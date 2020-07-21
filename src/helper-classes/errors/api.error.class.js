'use strict';


/**
 * class to denote API error response capture
 */
class APIError extends Error {
    constructor(message = 'Error', code = 500) {
        super(message);

        this.name = 'APIError';
        this.code = code;
    }

    /**
     * send the error as response in HAPI
     * @param h {{}}
     * @returns {*}
     */
    send(h) {
        return h.response({
            message: this.message
        }).type('application/json').code(this.code);
    }
}


class APIErrorBadRequest extends APIError {
    constructor(message = 'Bad Request', code = 400) {
        super(message, code);
    }
}


class APIErrorUnauthorised extends APIError {
    constructor(message = 'Unauthorised', code = 401) {
        super(message, code);
    }
}


class APIErrorPaymentRequired extends APIError {
    constructor(message = 'Payment Required', code = 402) {
        super(message, code);
    }
}


class APIErrorForbidden extends APIError {
    constructor(message = 'Forbidden', code = 403) {
        super(message, code);
    }
}


class APIErrorNotFound extends APIError {
    constructor(message = 'Not Found', code = 404) {
        super(message, code);
    }
}


class APIErrorRequestTimeout extends APIError {
    constructor(message = 'Request Timeout', code = 408) {
        super(message, code);
    }
}


class APIErrorConflict extends APIError {
    constructor(message = 'Conflict', code = 409) {
        super(message, code);
    }
}


class APIErrorGone extends APIError {
    constructor(message = 'Gone', code = 410) {
        super(message, code);
    }
}


class APIErrorLengthRequired extends APIError {
    constructor(message = 'Length Required', code = 411) {
        super(message, code);
    }
}


class APIErrorPreconditionFailed extends APIError {
    constructor(message = 'Precondition Failed', code = 412) {
        super(message, code);
    }
}


class APIErrorPayloadTooLarge extends APIError {
    constructor(message = 'Payload Too Large', code = 413) {
        super(message, code);
    }
}


class APIErrorUnsupportedMediaType extends APIError {
    constructor(message = 'Unsupported Media Type', code = 415) {
        super(message, code);
    }
}


class APIErrorImATeapot extends APIError {
    constructor(message = 'I\'m a teapot', code = 418) {
        super(message, code);
    }
}


class APIErrorInternalServerError extends APIError {
    constructor(message = 'Internal Server Error', code = 500) {
        super(message, code);
    }
}


module.exports = {
    APIError,
    APIErrorBadRequest,
    APIErrorUnauthorised,
    APIErrorPaymentRequired,
    APIErrorForbidden,
    APIErrorNotFound,
    APIErrorRequestTimeout,
    APIErrorConflict,
    APIErrorGone,
    APIErrorLengthRequired,
    APIErrorPreconditionFailed,
    APIErrorPayloadTooLarge,
    APIErrorUnsupportedMediaType,
    APIErrorImATeapot,
    APIErrorInternalServerError
};

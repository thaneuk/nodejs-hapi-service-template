'use strict';


const ApiErrorClassModule = require('../../src/helper-classes/errors/api.error.class.js');


describe('Api Error module returns classes extended from Error for use to return api errors', () => {
    it('should return an object of errors', () => {
        expect(ApiErrorClassModule).toBeObject();
        expect(ApiErrorClassModule).toHaveProperty('APIError');
        expect(ApiErrorClassModule.APIError).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorBadRequest');
        expect(ApiErrorClassModule.APIErrorBadRequest).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorUnauthorised');
        expect(ApiErrorClassModule.APIErrorUnauthorised).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorPaymentRequired');
        expect(ApiErrorClassModule.APIErrorPaymentRequired).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorForbidden');
        expect(ApiErrorClassModule.APIErrorForbidden).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorNotFound');
        expect(ApiErrorClassModule.APIErrorNotFound).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorRequestTimeout');
        expect(ApiErrorClassModule.APIErrorRequestTimeout).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorConflict');
        expect(ApiErrorClassModule.APIErrorConflict).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorGone');
        expect(ApiErrorClassModule.APIErrorGone).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorLengthRequired');
        expect(ApiErrorClassModule.APIErrorLengthRequired).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorPreconditionFailed');
        expect(ApiErrorClassModule.APIErrorPreconditionFailed).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorPayloadTooLarge');
        expect(ApiErrorClassModule.APIErrorPayloadTooLarge).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorUnsupportedMediaType');
        expect(ApiErrorClassModule.APIErrorUnsupportedMediaType).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorImATeapot');
        expect(ApiErrorClassModule.APIErrorImATeapot).toBeFunction();
        expect(ApiErrorClassModule).toHaveProperty('APIErrorInternalServerError');
        expect(ApiErrorClassModule.APIErrorInternalServerError).toBeFunction();
    });

    it('each api error should be an extension of Error', () => {
        expect(new ApiErrorClassModule.APIError()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorBadRequest()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorUnauthorised()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorPaymentRequired()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorForbidden()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorNotFound()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorRequestTimeout()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorConflict()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorGone()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorLengthRequired()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorPreconditionFailed()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorPayloadTooLarge()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorUnsupportedMediaType()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorImATeapot()).toBeInstanceOf(Error);
        expect(new ApiErrorClassModule.APIErrorInternalServerError()).toBeInstanceOf(Error);
    });

    describe('each api error should have default message and code', () => {
        const apiError = new ApiErrorClassModule.APIError();
        const apiErrorBadRequest = new ApiErrorClassModule.APIErrorBadRequest();
        const apiErrorUnauthorised = new ApiErrorClassModule.APIErrorUnauthorised();
        const apiErrorPaymentRequired = new ApiErrorClassModule.APIErrorPaymentRequired();
        const apiErrorForbidden = new ApiErrorClassModule.APIErrorForbidden();
        const apiErrorNotFound = new ApiErrorClassModule.APIErrorNotFound();
        const apiErrorRequestTimeout = new ApiErrorClassModule.APIErrorRequestTimeout();
        const apiErrorConflict = new ApiErrorClassModule.APIErrorConflict();
        const apiErrorGone = new ApiErrorClassModule.APIErrorGone();
        const apiErrorLengthRequired = new ApiErrorClassModule.APIErrorLengthRequired();
        const apiErrorPreconditionFailed = new ApiErrorClassModule.APIErrorPreconditionFailed();
        const apiErrorPayloadTooLarge = new ApiErrorClassModule.APIErrorPayloadTooLarge();
        const apiErrorUnsupportedMediaType = new ApiErrorClassModule.APIErrorUnsupportedMediaType();
        const apiErrorImATeapot = new ApiErrorClassModule.APIErrorImATeapot();
        const apiErrorInternalServerError = new ApiErrorClassModule.APIErrorInternalServerError();

        const jestCodeFn = jest.fn(() => 'chain complete');
        const jestTypeFn = jest.fn(() => ({code: jestCodeFn}));
        const jestResponseFn = jest.fn(() => ({type: jestTypeFn}));

        it('should create "apiError" correctly and properties/methods should have values and run as expected',  () => {
            expect(apiError).toHaveProperty('message');
            expect(apiError.message).toBeString();
            expect(apiError.message).toStrictEqual('Error');
            expect(apiError).toHaveProperty('code');
            expect(apiError.code).toBeNumber();
            expect(apiError.code).toStrictEqual(500);
            expect(apiError.send).toBeFunction();

            expect(apiError.send({response: jestResponseFn})).toStrictEqual('chain complete');
            expect(jestResponseFn.mock.calls.length).toBeGreaterThan(0);
            expect(jestTypeFn.mock.calls.length).toBeGreaterThan(0);
            expect(jestCodeFn.mock.calls.length).toBeGreaterThan(0);
        });


        it('other errors should generate as expected', () => {
            expect(apiErrorBadRequest).toHaveProperty('message');
            expect(apiErrorBadRequest.message).toBeString();
            expect(apiErrorBadRequest.message).toStrictEqual('Bad Request');
            expect(apiErrorBadRequest).toHaveProperty('code');
            expect(apiErrorBadRequest.code).toBeNumber();
            expect(apiErrorBadRequest.code).toStrictEqual(400);

            expect(apiErrorUnauthorised).toHaveProperty('message');
            expect(apiErrorUnauthorised.message).toBeString();
            expect(apiErrorUnauthorised.message).toStrictEqual('Unauthorised');
            expect(apiErrorUnauthorised).toHaveProperty('code');
            expect(apiErrorUnauthorised.code).toBeNumber();
            expect(apiErrorUnauthorised.code).toStrictEqual(401);

            expect(apiErrorPaymentRequired).toHaveProperty('message');
            expect(apiErrorPaymentRequired.message).toBeString();
            expect(apiErrorPaymentRequired.message).toStrictEqual('Payment Required');
            expect(apiErrorPaymentRequired).toHaveProperty('code');
            expect(apiErrorPaymentRequired.code).toBeNumber();
            expect(apiErrorPaymentRequired.code).toStrictEqual(402);

            expect(apiErrorForbidden).toHaveProperty('message');
            expect(apiErrorForbidden.message).toBeString();
            expect(apiErrorForbidden.message).toStrictEqual('Forbidden');
            expect(apiErrorForbidden).toHaveProperty('code');
            expect(apiErrorForbidden.code).toBeNumber();
            expect(apiErrorForbidden.code).toStrictEqual(403);

            expect(apiErrorNotFound).toHaveProperty('message');
            expect(apiErrorNotFound.message).toBeString();
            expect(apiErrorNotFound.message).toStrictEqual('Not Found');
            expect(apiErrorNotFound).toHaveProperty('code');
            expect(apiErrorNotFound.code).toBeNumber();
            expect(apiErrorNotFound.code).toStrictEqual(404);

            expect(apiErrorRequestTimeout).toHaveProperty('message');
            expect(apiErrorRequestTimeout.message).toBeString();
            expect(apiErrorRequestTimeout.message).toStrictEqual('Request Timeout');
            expect(apiErrorRequestTimeout).toHaveProperty('code');
            expect(apiErrorRequestTimeout.code).toBeNumber();
            expect(apiErrorRequestTimeout.code).toStrictEqual(408);

            expect(apiErrorConflict).toHaveProperty('message');
            expect(apiErrorConflict.message).toBeString();
            expect(apiErrorConflict.message).toStrictEqual('Conflict');
            expect(apiErrorConflict).toHaveProperty('code');
            expect(apiErrorConflict.code).toBeNumber();
            expect(apiErrorConflict.code).toStrictEqual(409);

            expect(apiErrorGone).toHaveProperty('message');
            expect(apiErrorGone.message).toBeString();
            expect(apiErrorGone.message).toStrictEqual('Gone');
            expect(apiErrorGone).toHaveProperty('code');
            expect(apiErrorGone.code).toBeNumber();
            expect(apiErrorGone.code).toStrictEqual(410);

            expect(apiErrorLengthRequired).toHaveProperty('message');
            expect(apiErrorLengthRequired.message).toBeString();
            expect(apiErrorLengthRequired.message).toStrictEqual('Length Required');
            expect(apiErrorLengthRequired).toHaveProperty('code');
            expect(apiErrorLengthRequired.code).toBeNumber();
            expect(apiErrorLengthRequired.code).toStrictEqual(411);

            expect(apiErrorPreconditionFailed).toHaveProperty('message');
            expect(apiErrorPreconditionFailed.message).toBeString();
            expect(apiErrorPreconditionFailed.message).toStrictEqual('Precondition Failed');
            expect(apiErrorPreconditionFailed).toHaveProperty('code');
            expect(apiErrorPreconditionFailed.code).toBeNumber();
            expect(apiErrorPreconditionFailed.code).toStrictEqual(412);

            expect(apiErrorPayloadTooLarge).toHaveProperty('message');
            expect(apiErrorPayloadTooLarge.message).toBeString();
            expect(apiErrorPayloadTooLarge.message).toStrictEqual('Payload Too Large');
            expect(apiErrorPayloadTooLarge).toHaveProperty('code');
            expect(apiErrorPayloadTooLarge.code).toBeNumber();
            expect(apiErrorPayloadTooLarge.code).toStrictEqual(413);

            expect(apiErrorUnsupportedMediaType).toHaveProperty('message');
            expect(apiErrorUnsupportedMediaType.message).toBeString();
            expect(apiErrorUnsupportedMediaType.message).toStrictEqual('Unsupported Media Type');
            expect(apiErrorUnsupportedMediaType).toHaveProperty('code');
            expect(apiErrorUnsupportedMediaType.code).toBeNumber();
            expect(apiErrorUnsupportedMediaType.code).toStrictEqual(415);

            expect(apiErrorImATeapot).toHaveProperty('message');
            expect(apiErrorImATeapot.message).toBeString();
            expect(apiErrorImATeapot.message).toStrictEqual('I\'m a teapot');
            expect(apiErrorImATeapot).toHaveProperty('code');
            expect(apiErrorImATeapot.code).toBeNumber();
            expect(apiErrorImATeapot.code).toStrictEqual(418);

            expect(apiErrorInternalServerError).toHaveProperty('message');
            expect(apiErrorInternalServerError.message).toBeString();
            expect(apiErrorInternalServerError.message).toStrictEqual('Internal Server Error');
            expect(apiErrorInternalServerError).toHaveProperty('code');
            expect(apiErrorInternalServerError.code).toBeNumber();
            expect(apiErrorInternalServerError.code).toStrictEqual(500);
        });

    });
});

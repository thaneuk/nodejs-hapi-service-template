'use strict';


const rest = require('../src/helper-classes/rest/rest.js');
let server;
let port;


beforeAll(() => {
    process.env.NODE_ENV = 'test';
    server = require('../src/server.js');

    server.then(s => {
        console.log(s);
        port = s.settings.port;
    });

    return server;
});

/* stand down HAPI server instance and end  */
afterAll(() => {
    return server.then(server => server.stop()).catch(error => console.error('error stopping server', error));
});


describe('test endpoints return expected responses', () => {
    describe('call to "/wsgwfsgsg" that is not valid endpoint', () => {
        it('should result in a 404 response', () => {
            const request = rest.get(`http://localhost:${port}/wsgwfsgsg`, {
                verbose: true,
                followRedirects: false
            });

            expect(request).toReject();

            return request.catch(responseError => {
                expect(responseError.statusCode).toStrictEqual(404);
                expect(responseError.responseBody).toStrictEqual('Page Not Found!');
                expect(responseError.message).toStartWith('404 when calling');
            });
        });
    });

    describe('call to "/" should result in 302 redirect', () => {
        it('should result in redirect', () => {
            const responsePromise = rest.get(`http://localhost:${port}/`, {
                verbose: true,
                followRedirects: false
            });

            expect(responsePromise).toReject();

            return responsePromise.catch(error => {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('statusCode');
                expect(error.statusCode).toBeNumber();
                expect(error.statusCode).toStrictEqual(302);
                expect(error.headers).toBeObject();
                expect(error.headers).toHaveProperty('location');
                expect(error.headers.location).toStrictEqual('/documentation');
            });
        });
    });

    describe('call to /health should result with service health information', () => {
        it('should return an object', async () => {
            const request = await rest.get(`http://localhost:${port}/health`, {
                verbose: true,
                followRedirects: false
            });

            const healthResponse = request.body;

            expect(request.statusCode).toBeNumber();
            expect(request.statusCode).toStrictEqual(200);

            expect(healthResponse).toBeObject();
            expect(healthResponse).toHaveProperty('nodeVersion');
            expect(healthResponse.nodeVersion).toBeString();
            expect(healthResponse).toHaveProperty('processId');
            expect(healthResponse.processId).toBeNumber();
            expect(healthResponse).toHaveProperty('platform');
            expect(healthResponse.platform).toBeString();
            expect(healthResponse).toHaveProperty('started');
            expect(healthResponse.started).toBeString();
            expect(healthResponse).toHaveProperty('uptime');
            expect(healthResponse.uptime).toBeNumber();
            expect(healthResponse).toHaveProperty('memory');
            expect(healthResponse.memory).toBeObject();
        });
    });
});

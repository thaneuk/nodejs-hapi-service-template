'use strict';


/*
 * Register HAPI events to log messages of import
 */


const nodeEnv = (process.env.NODE_ENV + '').toLowerCase();


module.exports = server => {

    /* log startup of HAPI server */
    server.events.on('start', () => {
        console.info(`Node Server running at ${nodeEnv === 'dev' ? `http://localhost:${server.info.port}` : server.info.uri} on PID ${process.pid}\n`);
    });

    /* log if HAPI terminates */
    server.events.on('stop', () => nodeEnv !== 'test' && console.warn(`Node Server stopped`));

    /* log registration of routes */
    server.events.on('route', route => !route.path.startsWith('/swaggerui/') && console.info(`Route added ${route.method.toUpperCase()} ${route.path}`));

    /* log requests of routes */
    server.events.on('request', request => nodeEnv !== 'test' && console.info(`Request ${request.method.toUpperCase()} ${request.path}`));

    /* log all API calls */
    server.events.on('response', request =>
        console[request.response.statusCode >= 200 && request.response.statusCode < 400 ? 'info' : 'error']
        (`${request.response.statusCode} ${request.method.toUpperCase()} ${request.server.info.uri}${request.path} ${request.route.path} DUR ${request.info.completed - request.info.received}ms`)
    );

    /* log if any call throws a boom */
    server.ext('onPreResponse', (request, h) => {
        if (!request.response.isBoom) {
            /* no error so continue */
            return h.continue;
        } else {
            /* hapi throws a boom if the handler errors */
            return h.response(request.response.message === 'token is null' ? 'Invalid token' : request.response.message).code(request.response.output.statusCode);
        }
    });

};

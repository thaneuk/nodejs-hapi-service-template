'use strict';


const pack = require('../package.json');
console.log(`\n[${new Date().toISOString()}] Starting service "${pack.name}" version "${pack.version}"\n`);
const hapi = require('@hapi/hapi');


const server = hapi.server({
    port: process.env.PORT || process.env.port || 8080,
    compression: {
        minBytes: 1024
    },
    load: {
        sampleInterval: 2,
        maxRssBytes: 400000000,
        /* 15 minute max request duration */
        maxEventLoopDelay: 60000 * 15
    }
});


/* module export server so tests can wait on server start and then stop on completion */
module.exports = server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
    {
        plugin: require('hapi-swagger'),
        options: {
            info: {
                title: pack.name,
                version: pack.version
            }
        }
    }
]).then(async () => {
    /* call request logger that will register events for logging */
    require('./helper-classes/request.logging.js')(server);

    server.route(await require('./helper-classes/route.list.loader.js'));

    return server.start();
}).then(async () => {
    /* server started */
    /* call any initializers or components that require starting here */

    return server;
}).catch(error => {
    console.error('Server failed to start', error);
    process.exit(1);
});

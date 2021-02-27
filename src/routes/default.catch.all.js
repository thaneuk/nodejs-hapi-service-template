'use strict';


module.exports = [{
    method: '*',
    path: '/{any*}',
    handler: (request, h) => h.response('Page Not Found!').type('text/html').code(404),
    config: {
        auth: false,
        plugins: {
            'hapi-swagger': {
                responses: {
                    '404': require('./validation-models/404.js')
                }
            }
        }
    }
}];

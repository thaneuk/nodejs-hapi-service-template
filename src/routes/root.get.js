'use strict';


module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, h) => h.redirect('/documentation'),
    config: {
        auth: false
    }
}];

'use strict';


module.exports = [{
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        return h.redirect('/documentation');
    },
    config: {
        auth: false
    }
}];

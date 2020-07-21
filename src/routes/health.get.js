'use strict';


const Joi = require('@hapi/joi');
const health = require('../controllers/health.controller.js');


module.exports = [{
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
        return h.response(health.response).type('application/json').code(200);
    },
    config: {
        auth: false,
        cors: {
            origin: ['*.homedepot.com', '*//localhost:*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
        description: 'health check',
        notes: 'health endpoint, responds with memory usage',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                responses: {
                    '200': {
                        description: 'Success',
                        schema: Joi.object({
                            nodeVersion: Joi.string().required(),
                            processId: Joi.number().required(),
                            platform: Joi.string().required(),
                            started: Joi.string().required(),
                            uptime: Joi.number().required(),
                            memory: Joi.object({
                                rss: Joi.number().required(),
                                heapTotal: Joi.number().required(),
                                heapUsed: Joi.number().required(),
                                external: Joi.number().required()
                            })
                        })
                    },
                    '500': {
                        description: 'Internal Server Error',
                        schema: require('./validation-models/500.js')
                    }
                }
            }
        }
    }
}];

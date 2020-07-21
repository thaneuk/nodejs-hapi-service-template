'use strict';


const Joi = require('@hapi/joi');


module.exports = Joi.object({
    statusCode: Joi.number().required().example(404),
    error: Joi.string().required().example('Not Found'),
    message: Joi.string().required().example('Not Found')
}).label('Not Found');

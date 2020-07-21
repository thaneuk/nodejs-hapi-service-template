'use strict';


const Joi = require('@hapi/joi');


module.exports = Joi.object({
    statusCode: Joi.number().required().example(400),
    error: Joi.string().required().example('Bad Request'),
    message: Joi.string().required().example('Invalid request query input')
}).label('Invalid');

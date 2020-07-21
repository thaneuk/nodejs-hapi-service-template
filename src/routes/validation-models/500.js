'use strict';


const Joi = require('@hapi/joi');


module.exports = Joi.object({
    statusCode: Joi.number().required().example(500),
    error: Joi.string().required().example('Internal Server Error'),
    message: Joi.string().required().example('An internal server error occurred')
}).label('Internal Server Error');

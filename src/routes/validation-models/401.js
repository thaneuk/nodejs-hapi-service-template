'use strict';


const Joi = require('joi');


module.exports = Joi.object({
    statusCode: Joi.number().required().example(401),
    error: Joi.string().required().example('Unauthorized'),
    message: Joi.string().required().example('Missing authentication')
}).label('Unauthorised');

const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().min(2).max(40),
    email: Joi.string().email().allow(null),
    password: Joi.string().allow(null),
});

module.exports = schema;

const Joi = require('joi');

const schema = Joi.object().keys({
    imageId: Joi.number().integer().min(1),
    personId: Joi.number().integer().min(1),
});

module.exports = schema;
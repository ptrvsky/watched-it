const Joi = require('joi');

const schema = Joi.object().keys({
    title: Joi.string().min(2).max(100),
    length: Joi.number().integer().min(1).max(999999),
    releaseDate: Joi.date().min('1-1-1800'),
    isSerie: Joi.boolean().default(false)
});

module.exports = schema;
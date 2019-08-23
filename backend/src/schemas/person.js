const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().min(2).max(70),
    dob: Joi.date().min('1-1-1800').max('now').allow(null),
    dod: Joi.date().min('1-1-1800').max('now').allow(null),
    birthplace: Joi.string().min(2).max(70).allow(null),
});

module.exports = schema;

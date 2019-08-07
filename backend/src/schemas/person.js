const Joi = require('joi');

const schema = Joi.object().keys({
    name: Joi.string().min(2).max(70),
    dob: Joi.date().min('1-1-1800').max('now'),
    dod: Joi.date().min('1-1-1800').max('now'),
    birthplace: Joi.string().min(2).max(70)
});

module.exports = schema;
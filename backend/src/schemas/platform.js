const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(40),
});

module.exports = schema;

const Joi = require('joi');

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(40),
  logoId: Joi.number().integer().min(1).allow(null),
});

module.exports = schema;

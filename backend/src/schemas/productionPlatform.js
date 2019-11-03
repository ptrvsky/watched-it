const Joi = require('joi');

const schema = Joi.object().keys({
  productionId: Joi.number().integer().min(1),
  platformId: Joi.number().integer().min(1),
});

module.exports = schema;

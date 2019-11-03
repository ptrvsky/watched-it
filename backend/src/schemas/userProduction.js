const Joi = require('joi');

const schema = Joi.object().keys({
  userId: Joi.number().integer().min(1),
  productionId: Joi.number().integer().min(1),
});

module.exports = schema;

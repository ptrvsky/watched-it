const Joi = require('joi');

const schema = Joi.object().keys({
  url: Joi.string().regex(/^[A-Za-z0-9/_-]+(.jpeg|.jpg|.png)$/),
  productionId: Joi.number().integer().min(1).allow(null),
});

module.exports = schema;

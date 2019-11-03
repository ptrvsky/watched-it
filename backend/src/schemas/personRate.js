/* eslint-disable newline-per-chained-call */
const Joi = require('joi');

const schema = Joi.object().keys({
  personId: Joi.number().integer().min(1),
  userId: Joi.number().integer().min(1),
  value: Joi.number().integer().min(1).max(10).allow(null),
});

module.exports = schema;

const Joi = require('joi');

const schema = Joi.object().keys({
    url: Joi.string().regex(/^[A-Za-z0-9\/]+(.jpeg|.jpg|.png)$/),
    productionId: Joi.number().integer().min(1)
});

module.exports = schema;
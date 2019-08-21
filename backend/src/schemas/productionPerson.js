const Joi = require('joi');

const schema = Joi.object().keys({
    personId: Joi.number().integer().min(1),
    productionId: Joi.number().integer().min(1),
    role: Joi.string().valid('Actor', 'Writer', 'Director', 'Composer', 'Producer'),
    description: Joi.string().max(50).allow(null)
});

module.exports = schema;
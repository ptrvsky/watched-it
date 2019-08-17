const Joi = require('joi');

const schema = Joi.object().keys({
    title: Joi.string().min(2).max(100),
    length: Joi.number().integer().min(1).max(999999).allow(null),
    releaseDate: Joi.date().min('1-1-1800').allow(null),
    isSerie: Joi.boolean().default(false).allow(null),
    genre: Joi.array().items(Joi.string().valid(
        'Action', 'Adventure', 'Animation', 'Biography', 
        'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 
        'History', 'Horror', 'Musical', 'Mystery', 'Romance', 
        'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western')).allow(null),
    description: Joi.string().max(500).allow(null)
});

module.exports = schema;
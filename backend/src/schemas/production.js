const Joi = require('joi');

const schema = Joi.object().keys({
    title: Joi.string().min(2).max(100),
    length: Joi.number().integer().min(1).max(999999),
    releaseDate: Joi.date().min('1-1-1800'),
    isSerie: Joi.boolean().default(false),
    genre: Joi.array().items(Joi.string().valid(
        'Action', 'Adventure', 'Animation', 'Biography', 
        'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 
        'History', 'Horror', 'Musical', 'Mystery', 'Romance', 
        'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western')),
    description: Joi.string().max(500)
});

module.exports = schema;
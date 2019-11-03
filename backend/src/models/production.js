const Sequelize = require('sequelize');
const db = require('../config/database.js');

const Production = db.define('production', {
  title: {
    type: Sequelize.STRING,
  },
  length: {
    type: Sequelize.INTEGER,
  },
  releaseDate: {
    type: Sequelize.DATE,
  },
  isSerie: {
    type: Sequelize.BOOLEAN,
  },
  genre: {
    type: Sequelize.ARRAY(Sequelize.ENUM(
      'Action', 'Adventure', 'Animation', 'Biography',
      'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy',
      'History', 'Horror', 'Musical', 'Mystery', 'Romance',
      'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western',
    )),
  },
  description: {
    type: Sequelize.STRING,
  },
  posterId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Production;

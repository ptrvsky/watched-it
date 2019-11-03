const Sequelize = require('sequelize');
const db = require('../config/database.js');

const Image = db.define('image', {
  url: {
    type: Sequelize.STRING,
  },
  productionId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Image;

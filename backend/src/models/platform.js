const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about platforms that contains productions
const Platform = db.define('platform', {
  name: {
    type: Sequelize.STRING,
  },
  logoId: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Platform;

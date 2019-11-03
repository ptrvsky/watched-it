const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about assignments between productions and platforms
const ProductionPlatform = db.define('production_platform', {
  productionId: {
    type: Sequelize.INTEGER,
  },
  platformId: {
    type: Sequelize.INTEGER,
  },
}, {
  tableName: 'productions_platforms',
});

module.exports = ProductionPlatform;

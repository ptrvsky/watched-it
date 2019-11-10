const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about assignments between productions and platforms
const ProductionPlatform = db.define('production_platform', {
  productionId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  platformId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'productions_platforms',
});

module.exports = ProductionPlatform;

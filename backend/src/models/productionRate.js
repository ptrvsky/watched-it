const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about productions rates submited by users
const ProductionRate = db.define('production_rate', {
  productionId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  value: {
    type: Sequelize.INTEGER,
  },
}, {
  tableName: 'productions_rates',
});

module.exports = ProductionRate;

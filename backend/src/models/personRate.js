const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about people rates submited by users
const PersonRate = db.define('person_rate', {
  personId: {
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
  tableName: 'people_rates',
});

module.exports = PersonRate;

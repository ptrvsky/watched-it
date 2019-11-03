const Sequelize = require('sequelize');
const db = require('../config/database.js');

const Person = db.define('person', {
  name: {
    type: Sequelize.STRING,
  },
  dob: {
    type: Sequelize.DATE,
  },
  dod: {
    type: Sequelize.DATE,
  },
  birthplace: {
    type: Sequelize.STRING,
  },
  faceImageId: {
    type: Sequelize.INTEGER,
  },
  biography: {
    type: Sequelize.STRING,
  },
});

module.exports = Person;

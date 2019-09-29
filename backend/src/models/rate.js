const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about productions rates submited by users
const Rate = db.define('rate', {
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
});

module.exports = Rate;

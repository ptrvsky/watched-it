const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about productions added to users watchlists
const UserProduction = db.define('user_production', {
    userId: {
        type: Sequelize.INTEGER,
    },
    productionId: {
        type: Sequelize.INTEGER,
    },
}, {
    tableName: 'users_productions',
});

module.exports = UserProduction;

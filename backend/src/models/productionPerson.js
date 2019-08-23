const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about assignments between productions and people
const ProductionPerson = db.define('production_person', {
    personId: {
        type: Sequelize.INTEGER,
    },
    productionId: {
        type: Sequelize.INTEGER,
    },
    role: {
        type: Sequelize.ENUM('Actor', 'Writer', 'Director', 'Composer', 'Producer'),
    },
    description: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'productions_people',
});

module.exports = ProductionPerson;

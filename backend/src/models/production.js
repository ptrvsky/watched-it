const Sequelize = require('sequelize');
const db = require('../config/database.js');

const Production = db.define('production', {
    title: {
        type: Sequelize.STRING
    },
    length: {
        type: Sequelize.INTEGER
    },
    releaseDate: {
        type: Sequelize.DATE
    },
    isSerie: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = Production;

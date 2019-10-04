const Sequelize = require('sequelize');
const db = require('../config/database.js');

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.ENUM('Admin', 'Moderator', 'User'),
    },
});

module.exports = User;

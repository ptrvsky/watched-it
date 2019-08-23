const Sequelize = require('sequelize');
const db = require('../config/database.js');

// Stores information about assignments between images and people
const ImagePerson = db.define('image_person', {
    imageId: {
        type: Sequelize.INTEGER,
    },
    personId: {
        type: Sequelize.INTEGER,
    },
}, {
    tableName: 'images_people',
});

module.exports = ImagePerson;

const Sequelize = require('sequelize');

let dbName = process.env.DEVELOPMENT_DB_NAME;

if (process.env.NODE_ENV === 'production') {
    dbName = process.env.PRODUCTION_DB_NAME;
}

const db = new Sequelize(dbName, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

module.exports = db;

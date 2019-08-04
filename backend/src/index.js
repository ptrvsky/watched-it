require('dotenv').config({ path: '.env' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('../config/database.js');

// Test database connection
db.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.json({ status: "ON" })
});

let server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port', server.address().port);
});


/* eslint-disable no-console */
require('dotenv').config({ path: '.env' });
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const db = require('./config/database');

// Test database connection
db.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

app.get('/api', (req, res) => {
    res.json({ status: 'ON' });
});

// Static assets
app.use('/api/uploads', express.static('uploads'));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/productions', require('./routes/productions'));
app.use('/api/people', require('./routes/people'));
app.use('/api/productions-people', require('./routes/productions-people'));
app.use('/api/images', require('./routes/images'));
app.use('/api/images-people/', require('./routes/images-people'));

// Error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.status(400).json({ error: err.message });
    } else {
        res.status(400).json({ error: err });
    }
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port', server.address().port);
});

module.exports = app;

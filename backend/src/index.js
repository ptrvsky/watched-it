require('dotenv').config({ path: '.env' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config/database');

// Test database connection
db.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.json({ status: "ON" })
});

// Static assets
app.use('/uploads', express.static('uploads'));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/productions', require('./routes/productions'));
app.use('/people', require('./routes/people'));
app.use('/productions-people', require('./routes/productions-people'));
app.use('/images', require('./routes/images'));
app.use('/images-people/', require('./routes/images-people'));

// Error handling
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        res.status(400).json({ error: err.message });
    } else {
        res.status(400).json({ error: err });
    }
});

let server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port', server.address().port);
});


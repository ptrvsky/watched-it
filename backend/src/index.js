require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ status: "ON" })
});

let server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port', server.address().port);
});


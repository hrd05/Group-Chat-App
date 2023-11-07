const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './', 'views','signup.html'))
})



app.listen(4000);
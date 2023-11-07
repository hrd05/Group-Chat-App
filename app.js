const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRoute);


sequelize.sync()
.then(() => {
    app.listen(4000);
})



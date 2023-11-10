const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

require('dotenv').config();

const User = require('./models/user');
const Message = require('./models/Message');

const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRoute);
app.use(chatRoute);


User.hasMany(Message);
Message.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(4000);
})



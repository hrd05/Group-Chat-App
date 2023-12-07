const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

require('dotenv').config();

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const Forgotpassword = require('./models/forgot-pass');

const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const resetRoute = require('./routes/reset');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRoute);
app.use(chatRoute);
app.use(resetRoute);



User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' });

sequelize.sync()
    .then(() => {
        app.listen(4000);
    })



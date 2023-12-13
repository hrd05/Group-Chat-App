const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const Forgotpassword = require('./models/forgot-pass');


const sequelize = require('./util/database');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const resetRoute = require('./routes/reset');
const cronService = require('./services/cron');
cronService.job.start();
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    // console.log('user connected', Math.random());
    socket.on('commongroup-message', () => {
        console.log('msg receive');
        socket.broadcast.emit('receive-common-message', 'new message received')
    })

    socket.on('group-message', (id) => {
        console.log('groupmsg receive', id)
        socket.broadcast.emit('receive-group-message', id)
    })

})

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
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
        server.listen(4000);
    })



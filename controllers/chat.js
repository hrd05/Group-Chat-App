const Message = require('../models/Message');
// const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.postMessage = (req, res) => {
    const user = req.user;
    console.log('in post', user);
    
    const message = req.body.message;

    Message.create({
        messageText: message,
        userId: user.id
    })
    .then(() => {
        res.status(201).json({message, userName: req.user.name});
    })
    .catch(err => console.log(err));

}

exports.getMessages = (req, res) => {
    const user = req.user;

    Message.findAll({where: {userId: user.id}})
    .then((messages) => {
        // console.log(messages)
        res.status(201).json({message: messages, userName: user.name});
    })
    .catch(err => {
        console.log(err);
    })
    
}
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

exports.postMessage = (req, res) => {
    const token = req.header('Authorization');
    console.log(token);
    const message = req.body.message;

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = user.userId;

    Message.create({
        messageText: message,
        userId: id
    })
    .then(() => {
        res.status(201).json(message);
    })
    .catch(err => console.log(err));

}
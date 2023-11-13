const Message = require('../models/Message');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { Op, Sequelize } = require('sequelize');

exports.postMessage = (req, res) => {
    const user = req.user;
    console.log('in post', user);

    const message = req.body.message;

    Message.create({
        messageText: message,
        userId: user.id
    })
        .then(() => {
            res.status(201).json({ message, userName: req.user.name });
        })
        .catch(err => console.log(err));

}

exports.getMessages = async (req, res) => {

    const token = req.header('Authorization');

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    

    try {
        const usersActive = await User.findAll({
            where: {
                isActive: true
            }
        })

        const userid = [];
        usersActive.forEach(users => {
            userid.push(users.id);
        });
        console.log(userid);
        Message.findAll({
            where: Sequelize.and({
                userId: userid
            }),
            include: [{ model: User, attributes: ['id', 'name'] }],
            order: [['createdAt']],
        })
            .then((messages) => {
                // console.log(messages)
                res.status(201).json({ message: messages, user: user});
            })
            .catch(err => {
                console.log(err);
            })

    } catch (err) {
        console.log(err);
    }
}
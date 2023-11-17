
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    console.log('in middleware');
    const token = req.header('Authorization');

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = user.userId;
    User.findByPk(id)
    .then((user) => {
        // console.log(user)
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
};

module.exports = {
    authenticate
}
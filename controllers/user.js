const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
}

exports.postUser = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNo = req.body.phoneNo;
    const password = req.body.password;
    // console.log(name,email);

    User.findOne({ where: { email } })
        .then((user) => {
            if (user) {
                return res.status(409).json({ message: 'User already exists' });
            }
            else {
                bcrypt.hash(password, 10, (err, hash) => {
                    User.create({ name, email, phoneNo, password: hash })
                        .then(() => {
                            res.status(201).json({ message: 'User signup successfull' });

                        })
                        .catch(err => {
                            res.status(400).json({ message: 'something went wrong', Error: err });
                        })
                })
            }
        })
};

function generateAcessToken(id) {
    console.log(process.env.DB_NAME,process.env.JWT_SECRET_KEY);
    return jwt.sign({userId: id}, process.env.JWT_SECRET_KEY);
}


exports.postLogin = async (req, res) => {
    console.log('in the post ');
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ where: { email: email } });
        const result = await bcrypt.compare(password, user.password);

        if (result) {
            res.status(201).json({ message: 'login successfull', token: generateAcessToken(user.id) });
        }
        else {
            res.status(401).json({ message: 'incorrect password' });
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'something went wrong' });
    }

}
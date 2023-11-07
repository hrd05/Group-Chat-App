const bcrypt = require('bcrypt');
const User = require('../models/user');


exports.postUser = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNo =req.body.phoneNo;
    const password = req.body.password;
    console.log(name,email);

    bcrypt.hash(password, 10, (err, hash) => {
        User.create({name, email, phoneNo, password: hash})
        .then(() => {
            res.status(201).json({message: 'User signup successfull'});
        })
        .catch(err => {
            res.status(400).json({message: 'something went wrong'});
        })
    })
    
    
}
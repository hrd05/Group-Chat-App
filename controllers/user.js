const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

const Group = require('../models/group');


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
                return res.status(409).end();
            } else {
                return;
            }
        })
    bcrypt.hash(password, 10, (err, hash) => {
        console.log(err);
        User.create({ name, email, phoneNo, password: hash, isActive: false })
            .then(() => {
                res.status(201).end();

            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ message: 'something went wrong' });
            })
    })

};

function generateAcessToken(id, name) {
    return jwt.sign({ userId: id , userName: name}, process.env.JWT_SECRET_KEY);
}


exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ where: { email: email } });
        const result = await bcrypt.compare(password, user.password);
        if (!user) {
            res.status(404).json({ message: 'user not found' });
        }

        if (result) {
            await user.update({isActive: true})
            res.status(201).json({ message: 'login successfull', token: generateAcessToken(user.id, user.name) });
        }
        else {
            res.status(401).json({ message: 'incorrect password' });
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'something went wrong' });
    }

}

exports.getUsers = async(req, res) => { 

    const token = req.header('Authorization');
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    try{
        const users = await User.findAll({
            where: {
                id: {
                    [Op.not]: user.userId
                }
            }
        });
        res.status(201).json(users);
    }catch(err) {
        res.status(500).json('something went wrong');
    }
   
}

exports.createGroup = async(req, res) => {

    const {groupName, groupMembersid, membersNo } = req.body.data;

    const user = req.user;

    try{
        const createdGroup = await Group.create({
            name: groupName,
            memberNo: membersNo
        })

        groupMembersid.push(user.id);

        const groupMembers = await User.findAll({
            where: {
                id: groupMembersid
            }
        })

        await createdGroup.addUsers(groupMembers);

        res.status(201).json({group: createdGroup, message: 'group created successfully'});


    }catch(err) {
        res.status(501).json('something went wrong');
        console.log(err);
    }


    
    
};
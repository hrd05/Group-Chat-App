const Message = require('../models/message');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { Op, Sequelize } = require('sequelize');

exports.postMessage = async (req, res) => {
    const user = req.user;
    const { message, groupId } = req.body.data;
    try {
        if (groupId == 0) {
            const chatMessage = await Message.create({
                messageText: message,
                userId: user.id,
            })
            return res.status(201).json({ message: chatMessage, username: req.user.name });
        }

        else {
            const chatMessage = await Message.create({
                messageText: message,
                userId: user.id,
                GroupId: groupId
            })
            return res.status(201).json({ message: chatMessage, username: req.user.name });
        }


    }
    catch (err) {
        console.log(err)
    };
}

// exports.getMessages = async (req, res) => {

//     const lastmessageid = req.query.lastmessageid;
//     console.log(lastmessageid);
//     const token = req.header('Authorization');

//     const user = jwt.verify(token, process.env.JWT_SECRET_KEY);


//     try {
//         const usersActive = await User.findAll({
//             where: {
//                 isActive: true
//             }
//         })

//         const userid = [];
//         usersActive.forEach(users => {
//             userid.push(users.id);
//         });
//         console.log(userid);

//         const queryOptions = {
//             where: {
//                 userId: {
//                     [Sequelize.Op.in]: userid
//                 }
//             },
//             include: [{ model: User, attributes: ['id', 'name'] }],
//             order: [['createdAt']]
//         };

//         if (lastmessageid !== undefined) {
//             queryOptions.where.messageId = {
//                 [Sequelize.Op.gt]: lastmessageid
//             };
//         }
//         Message.findAll(queryOptions)
//             .then((messages) => {
//                 // console.log(messages)
//                 res.status(201).json({ message: messages, user: user });
//             })
//             .catch(err => {
//                 console.log(err);
//             })

//     } catch (err) {
//         console.log(err);
//     }
// }

exports.getCommonChat = async (req, res) => {
    const user = req.user;
    try {
        const messages = await Message.findAll({
            where: {
                GroupId: null
            },
            include: [{ model: User, attributes: ['id', 'name'] }]
        })

        res.status(201).json({ messages, userid: user.id });
    }
    catch (err) {
        console.log(err);
    }


}

exports.getGroupChat = async (req, res) => {
    const groupid = req.query.groupid;
    const user = req.user;
    console.log(groupid, 'in groupchat');
    try {
        const messages = await Message.findAll({
            where: {
                GroupId: groupid
            },
            include: [{ model: User, attributes: ['id', 'name'] }]
        })

        res.status(201).json({ messages, userid: user.id });
    }
    catch (err) {
        console.log(err);
    }


}

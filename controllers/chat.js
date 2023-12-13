const Message = require('../models/message');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const s3Service = require('../services/s3Services');
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

exports.postImage = async (req, res) => {
    console.log('in post image');
    try {
        const user = req.user;
        const image = req.file;
        const { groupId } = req.body;
        const filename = `chat-images/group${groupId}/user${user.id}/${Date.now()}_${image.originalname}`;
        const imageURL = await s3Service.uploadToS3(image.buffer, filename)

        console.log(imageURL);
        if (groupId == 0) {
            await Message.create({
                messageText: imageURL,
                isImage: true,
                userId: user.id
            })
        }
        else {
            await Message.create({
                messageText: imageURL,
                isImage: true,
                userId: user.id,
                GroupId: groupId
            })
        }

        res.status(201).json({ message: 'image uploaded successfully' })

    }
    catch (err) {
        console.log(err);
        res.status(501).json({ message: 'somwthing went wrong' });
    }
}


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

const { CronJob } = require('cron');
const { Op } = require('sequelize');
const ArchiveChat = require('../models/archive-chat');
const Message = require('../models/message');

exports.job = new CronJob('0 0 * * *',
    function () {
        archiveOldChats();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldChats() {
    try {
        console.log('working');
        const date = new Date();
        date.setDate(date.getDate() - 1);
        console.log(date);

        const chatsToArchive = await Message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: date
                }
            }
        })
        console.log(chatsToArchive);
        await Promise.all(
            chatsToArchive.map(async (chat) => {
                await ArchiveChat.create({
                    messageId: chat.id,
                    messageText: chat.messageText,
                    isImage: chat.isImage,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                    userId: chat.userId,
                    GroupId: chat.GroupId
                });
                await chat.destroy();
            })
        )
        console.log('Old chats archived successfully.');
    }
    catch (error) {
        console.error('Error archiving old chats:', error);
    }

}




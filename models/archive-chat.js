const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ArchiveChat = sequelize.define('archive-chat', {
    messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    isImage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    messageText: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER
    },
    GroupId: {
        type: Sequelize.INTEGER
    }
});

module.exports = ArchiveChat;

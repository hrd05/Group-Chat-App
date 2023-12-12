const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Message = sequelize.define('Message', {
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
    }
});

module.exports = Message;
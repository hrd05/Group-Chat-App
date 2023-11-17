const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Group = sequelize.define('Group', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    memberNo: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Group;
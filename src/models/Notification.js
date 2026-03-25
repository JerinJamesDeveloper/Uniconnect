const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Notification = sequelize.define('Notification', {
  notificationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:         { type: DataTypes.INTEGER, allowNull: false },
  title:          { type: DataTypes.STRING, allowNull: false },
  body:           { type: DataTypes.TEXT },
  type:           { type: DataTypes.ENUM('assignment', 'attendance', 'announcement', 'chat', 'marks', 'general'), defaultValue: 'general' },
  dataJson:       { type: DataTypes.TEXT },
  isRead:         { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'notifications' });

module.exports = Notification;

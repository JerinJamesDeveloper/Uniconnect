const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Conversation = sequelize.define('Conversation', {
  conversationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user1Id:        { type: DataTypes.INTEGER, allowNull: false },
  user2Id:        { type: DataTypes.INTEGER, allowNull: false },
  lastMessageAt:  { type: DataTypes.DATE },
}, { tableName: 'conversations' });

const Message = sequelize.define('Message', {
  messageId:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.INTEGER, allowNull: false },
  senderId:       { type: DataTypes.INTEGER, allowNull: false },
  content:        { type: DataTypes.TEXT },
  type:           { type: DataTypes.ENUM('text', 'image', 'file'), defaultValue: 'text' },
  attachmentsJson:{ type: DataTypes.TEXT },
  isRead:         { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt:         { type: DataTypes.DATE },
}, { tableName: 'messages' });

module.exports = { Conversation, Message };

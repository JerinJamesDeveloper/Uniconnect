const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Announcement = sequelize.define('Announcement', {
  announcementId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postedById:     { type: DataTypes.INTEGER, allowNull: false },
  title:          { type: DataTypes.STRING, allowNull: false },
  content:        { type: DataTypes.TEXT, allowNull: false },
  type:           { type: DataTypes.ENUM('general', 'exam', 'event', 'urgent'), defaultValue: 'general' },
  audience:       { type: DataTypes.ENUM('all', 'students', 'faculty', 'specific_course'), defaultValue: 'all' },
  courseId:       { type: DataTypes.INTEGER },
  department:     { type: DataTypes.STRING },
  year:           { type: DataTypes.INTEGER },
  priority:       { type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'), defaultValue: 'medium' },
  attachmentsJson:{ type: DataTypes.TEXT },
  expiryDate:     { type: DataTypes.DATE },
}, { tableName: 'announcements' });

const AnnouncementRead = sequelize.define('AnnouncementRead', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  announcementId: { type: DataTypes.INTEGER, allowNull: false },
  userId:         { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'announcement_reads' });

module.exports = { Announcement, AnnouncementRead };

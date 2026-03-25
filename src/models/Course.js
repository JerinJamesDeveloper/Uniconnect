const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Course = sequelize.define('Course', {
  courseId:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseCode:  { type: DataTypes.STRING, allowNull: false, unique: true },
  courseName:  { type: DataTypes.STRING, allowNull: false },
  credits:     { type: DataTypes.INTEGER, defaultValue: 3 },
  department:  { type: DataTypes.STRING },
  semester:    { type: DataTypes.INTEGER },
  year:        { type: DataTypes.INTEGER },
  lecturerId:  { type: DataTypes.INTEGER },
  description: { type: DataTypes.TEXT },
  scheduleDays:  { type: DataTypes.STRING }, // JSON string
  scheduleTime:  { type: DataTypes.STRING },
  scheduleRoom:  { type: DataTypes.STRING },
}, { tableName: 'courses' });

module.exports = Course;

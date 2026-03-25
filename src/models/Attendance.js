const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Attendance = sequelize.define('Attendance', {
  attendanceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseId:     { type: DataTypes.INTEGER, allowNull: false },
  studentId:    { type: DataTypes.INTEGER, allowNull: false },
  markedById:   { type: DataTypes.INTEGER }, // lecturer/admin
  date:         { type: DataTypes.DATEONLY, allowNull: false },
  session:      { type: DataTypes.ENUM('morning', 'afternoon', 'full'), defaultValue: 'morning' },
  status:       { type: DataTypes.ENUM('present', 'absent', 'late', 'excused'), allowNull: false, defaultValue: 'absent' },
  remarks:      { type: DataTypes.TEXT },
}, { tableName: 'attendance' });

module.exports = Attendance;

const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Assignment = sequelize.define('Assignment', {
  assignmentId:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseId:        { type: DataTypes.INTEGER, allowNull: false },
  createdById:     { type: DataTypes.INTEGER, allowNull: false },
  title:           { type: DataTypes.STRING, allowNull: false },
  description:     { type: DataTypes.TEXT },
  deadline:        { type: DataTypes.DATE, allowNull: false },
  maxMarks:        { type: DataTypes.FLOAT, defaultValue: 100 },
  totalQuestions:  { type: DataTypes.INTEGER },
  instructions:    { type: DataTypes.TEXT },
  attachmentsJson: { type: DataTypes.TEXT }, // JSON array
}, { tableName: 'assignments' });

const Submission = sequelize.define('Submission', {
  submissionId:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assignmentId:  { type: DataTypes.INTEGER, allowNull: false },
  studentId:     { type: DataTypes.INTEGER, allowNull: false },
  fileUrl:       { type: DataTypes.STRING },
  comments:      { type: DataTypes.TEXT },
  submissionDate:{ type: DataTypes.DATE },
  marksObtained: { type: DataTypes.FLOAT },
  feedback:      { type: DataTypes.TEXT },
  gradingRemarks:{ type: DataTypes.TEXT },
  gradedDate:    { type: DataTypes.DATE },
  gradedById:    { type: DataTypes.INTEGER },
  status:        { type: DataTypes.ENUM('pending', 'submitted', 'graded', 'late'), defaultValue: 'pending' },
}, { tableName: 'submissions' });

module.exports = { Assignment, Submission };

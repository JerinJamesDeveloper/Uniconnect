const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Assessment = sequelize.define('Assessment', {
  assessmentId:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseId:       { type: DataTypes.INTEGER, allowNull: false },
  assessmentType: { type: DataTypes.ENUM('midterm', 'final', 'quiz', 'assignment', 'lab'), allowNull: false },
  assessmentName: { type: DataTypes.STRING, allowNull: false },
  maxMarks:       { type: DataTypes.FLOAT, allowNull: false },
  date:           { type: DataTypes.DATEONLY },
  createdById:    { type: DataTypes.INTEGER },
}, { tableName: 'assessments' });

const AssessmentMark = sequelize.define('AssessmentMark', {
  markId:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assessmentId:  { type: DataTypes.INTEGER, allowNull: false },
  studentId:     { type: DataTypes.INTEGER, allowNull: false },
  marksObtained: { type: DataTypes.FLOAT },
  remarks:       { type: DataTypes.TEXT },
}, { tableName: 'assessment_marks' });

module.exports = { Assessment, AssessmentMark };

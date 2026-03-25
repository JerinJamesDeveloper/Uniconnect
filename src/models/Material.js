const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');

const Material = sequelize.define('Material', {
  materialId:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseId:      { type: DataTypes.INTEGER, allowNull: false },
  uploadedById:  { type: DataTypes.INTEGER, allowNull: false },
  title:         { type: DataTypes.STRING, allowNull: false },
  description:   { type: DataTypes.TEXT },
  type:          { type: DataTypes.ENUM('lecture_notes', 'reference', 'syllabus', 'previous_papers'), defaultValue: 'lecture_notes' },
  topic:         { type: DataTypes.STRING },
  fileUrl:       { type: DataTypes.STRING },
  fileName:      { type: DataTypes.STRING },
  fileSize:      { type: DataTypes.STRING },
  fileType:      { type: DataTypes.STRING },
  downloadCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'materials' });

module.exports = Material;

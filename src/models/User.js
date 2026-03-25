const { DataTypes } = require('sequelize');
const sequelize     = require('../db/database');
const bcrypt        = require('bcryptjs');

const User = sequelize.define('User', {
  userId:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email:        { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password:     { type: DataTypes.STRING, allowNull: false },
  name:         { type: DataTypes.STRING, allowNull: false },
  role:         { type: DataTypes.ENUM('student', 'lecturer', 'admin'), allowNull: false, defaultValue: 'student' },
  status:       { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
  // Student fields
  studentId:    { type: DataTypes.STRING },
  department:   { type: DataTypes.STRING },
  year:         { type: DataTypes.INTEGER },
  semester:     { type: DataTypes.INTEGER },
  enrollmentDate: { type: DataTypes.DATEONLY },
  // Lecturer fields
  employeeId:   { type: DataTypes.STRING },
  designation:  { type: DataTypes.STRING },
  // Common
  phoneNumber:  { type: DataTypes.STRING },
  dateOfBirth:  { type: DataTypes.DATEONLY },
  address:      { type: DataTypes.TEXT },
  profilePicture: { type: DataTypes.STRING },
  fcmToken:     { type: DataTypes.STRING },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (u) => { if (u.password) u.password = await bcrypt.hash(u.password, 10); },
    beforeUpdate: async (u) => { if (u.changed('password')) u.password = await bcrypt.hash(u.password, 10); },
  },
});

User.prototype.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

User.prototype.toSafeJSON = function () {
  const obj = this.toJSON();
  delete obj.password;
  delete obj.fcmToken;
  return obj;
};

module.exports = User;

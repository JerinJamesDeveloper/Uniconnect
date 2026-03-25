const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: path.resolve(process.cwd(), process.env.DB_STORAGE || './uniconnect.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

module.exports = sequelize;

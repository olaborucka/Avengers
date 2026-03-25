require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData'
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData'
  }
};
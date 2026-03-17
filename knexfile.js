require('dotenv').config();

module.exports = {
  // ŚRODOWISKO DEVELOPMENT
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL, 
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds/development',
    }
  },

  // ŚRODOWISKO TEST
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL, 
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds/test',
    }
  } 
};
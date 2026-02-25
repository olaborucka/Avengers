require('dotenv').config();
const {pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Błąd puli połączeń z bazą:', err.message);
  process.exit(1); 
});

module.exports = pool;
const pool = require('../db');

const findAll = async ({ level, status } = {}) => {
    let query = 'SELECT id, location, level, status, hero_id FROM incidents';
    const values = [];
    const conditions = [];

    if (level) {
        values.push(level); 
        conditions.push(`level = $${values.length}`);
    }

    if (status) {
        values.push(status); 
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id';

    const { rows } = await pool.query(query, values);
    return rows;
};

const create = async ({ location, level }) => {
  const { rows } = await pool.query(
    'INSERT INTO incidents (location, level) VALUES ($1, $2) RETURNING *',
    [location, level]
  );
  return rows[0];
};


module.exports = { findAll, create };
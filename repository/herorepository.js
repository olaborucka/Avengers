const pool = require('../db');

const findAll = async ({ power, status } = {}) => {
    let query = 'SELECT id, name, power, status FROM heroes';
    const values = [];
    const conditions = [];

    if (power) {
        values.push(power); 
        conditions.push(`power = $${values.length}`);
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

const create = async ({ name, power }) => {
  const { rows } = await pool.query(
    'INSERT INTO heroes (name, power) VALUES ($1, $2) RETURNING *',
    [name, power]
  );
  return rows[0];
};


module.exports = { findAll, create };
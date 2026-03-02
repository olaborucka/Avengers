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

const findById = async (id) => {
    const {
        rows    } = await pool.query('SELECT id, location, level, status, hero_id FROM incidents WHERE id = $1', [id]);
    return rows[0];
};


const assignHeroToIncident = async (incidentId, heroId) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE heroes SET status = $1 WHERE id = $2',
      ['busy', heroId]
    );

    await client.query(
      'UPDATE incidents SET hero_id = $1, status = $2 WHERE id = $3',
      [heroId, 'assigned', incidentId]
    );
    
    await client.query('COMMIT'); 
    return true;

  } catch (error) {
    await client.query('ROLLBACK'); 
    throw error; 
  } finally {
    client.release(); 
  }
};

const resolveIncident = async (incidentId, heroId) => {
    const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE heroes SET status = $1 WHERE id = $2',
      ['available', heroId]
    );

    await client.query(
      'UPDATE incidents SET hero_id = $1, status = $2 WHERE id = $3',
      [heroId, 'resolved', incidentId]
    );
    
    await client.query('COMMIT'); 
    return true;

  } catch (error) {
    await client.query('ROLLBACK'); 
    throw error; 
  } finally {
    client.release(); 
  }
};


module.exports = { findAll, create, findById, assignHeroToIncident, resolveIncident };
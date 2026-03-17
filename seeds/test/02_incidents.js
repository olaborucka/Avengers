exports.seed = async function(knex) {
  // Równo 8 incydentów pokrywających różne kombinacje statusów
  await knex('incidents').insert([
    { id: 1, location: 'New York', district: 'Manhattan', level: 'critical', status: 'open', hero_id: null },
    { id: 2, location: 'London', district: 'Westminster', level: 'medium', status: 'open', hero_id: null },
    { id: 3, location: 'Tokyo', district: 'Shibuya', level: 'low', status: 'open', hero_id: null },
    
    { id: 4, location: 'Paris', district: 'Louvre', level: 'critical', status: 'assigned', hero_id: 1, assigned_at: knex.fn.now() },
    { id: 5, location: 'Berlin', district: 'Mitte', level: 'medium', status: 'assigned', hero_id: 2, assigned_at: knex.fn.now() },
    
    { id: 6, location: 'Warsaw', district: 'Srodmiescie', level: 'low', status: 'resolved', hero_id: 3, assigned_at: knex.fn.now(), resolved_at: knex.fn.now() },
    { id: 7, location: 'Rome', district: 'Colosseum', level: 'critical', status: 'resolved', hero_id: 4, assigned_at: knex.fn.now(), resolved_at: knex.fn.now() },
    { id: 8, location: 'Madrid', district: 'Centro', level: 'medium', status: 'resolved', hero_id: 5, assigned_at: knex.fn.now(), resolved_at: knex.fn.now() }
  ]);
};
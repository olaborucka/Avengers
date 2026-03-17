exports.seed = async function(knex) {
  // Równo 5 bohaterów z "jawnie zdefiniowanymi ID"
  await knex('heroes').insert([
    { id: 1, name: 'Test Iron Man', power: 'flight', status: 'available', missions_count: 10 },
    { id: 2, name: 'Test Hulk', power: 'strength', status: 'busy', missions_count: 5 },
    { id: 3, name: 'Test Prof X', power: 'telepathy', status: 'retired', missions_count: 50 },
    { id: 4, name: 'Test Quicksilver', power: 'speed', status: 'available', missions_count: 2 },
    { id: 5, name: 'Test Invisible Woman', power: 'invisibility', status: 'busy', missions_count: 8 }
  ]);
};
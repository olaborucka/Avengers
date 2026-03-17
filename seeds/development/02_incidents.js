const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  const heroes = await knex('heroes').select('id');
  const heroIds = heroes.map(h => h.id);
  const levels = ['low', 'medium', 'critical'];
  const statuses = ['open', 'assigned', 'resolved'];
  
  const fakeIncidents = [];

  for (let i = 0; i < 60; i++) { // RÓWNO 60 INCYDENTÓW
    const randomStatus = faker.helpers.arrayElement(statuses);
    let assignedHeroId = null;
    
    if (randomStatus !== 'open' && heroIds.length > 0) {
      assignedHeroId = faker.helpers.arrayElement(heroIds);
    }

    fakeIncidents.push({
      location: faker.location.streetAddress(),
      district: faker.location.city(),
      level: faker.helpers.arrayElement(levels),
      status: randomStatus,
      hero_id: assignedHeroId
    });
  }
  await knex('incidents').insert(fakeIncidents);
};
const { faker } = require('@faker-js/faker');
faker.seed(7); // WYMÓG Z POLECENIA! 

exports.seed = async function(knex) {
  const powers = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
  const statuses = ['available', 'busy', 'retired'];
  const fakeHeroes = [];
  
  for (let i = 0; i < 20; i++) { // RÓWNO 20 BOHATERÓW
    fakeHeroes.push({
      name: faker.person.firstName() + ' ' + faker.word.adjective(),
      power: faker.helpers.arrayElement(powers),
      status: faker.helpers.arrayElement(statuses),
      missions_count: faker.number.int({ min: 0, max: 100 })
    });
  }
  await knex('heroes').insert(fakeHeroes);
};
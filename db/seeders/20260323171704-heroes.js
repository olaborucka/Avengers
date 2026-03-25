'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    faker.seed(7); 

    const powers = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
    const statuses = ['available', 'busy', 'retired'];
    const heroes = [];

    for (let i = 0; i < 20; i++) {
      heroes.push({
        name: faker.person.firstName() + ' ' + faker.word.adjective(),
        power: faker.helpers.arrayElement(powers),
        status: faker.helpers.arrayElement(statuses),
        missions_count: faker.number.int({ min: 0, max: 100 }),
        // Sequelize wymaga w seederach ręcznego podawania dat!
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('heroes', heroes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('heroes', null, {});
  }
};
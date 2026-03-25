'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Też ustawiamy seed na 7 dla spójności
    faker.seed(7);

    // Najpierw pobieramy z bazy ID wygenerowanych przed chwilą bohaterów
    const [heroes] = await queryInterface.sequelize.query('SELECT id FROM heroes;');
    const heroIds = heroes.map(h => h.id);

    const levels = ['low', 'medium', 'critical'];
    const statuses = ['open', 'assigned', 'resolved'];
    const incidents = [];

    for (let i = 0; i < 60; i++) {
      const randomStatus = faker.helpers.arrayElement(statuses);
      let assignedHeroId = null;

      // Jeśli incydent jest w toku lub rozwiązany, przypisujemy mu losowego bohatera
      if (randomStatus !== 'open' && heroIds.length > 0) {
        assignedHeroId = faker.helpers.arrayElement(heroIds);
      }

      incidents.push({
        location: faker.location.streetAddress(),
        district: faker.location.city(),
        level: faker.helpers.arrayElement(levels),
        status: randomStatus,
        hero_id: assignedHeroId,
        assigned_at: randomStatus !== 'open' ? new Date() : null,
        resolved_at: randomStatus === 'resolved' ? new Date() : null,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('incidents', incidents, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('incidents', null, {});
  }
};
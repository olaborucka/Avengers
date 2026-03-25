'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('heroes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true
      },
      power: {
        type: Sequelize.ENUM('flight', 'strength', 'telepathy', 'speed', 'invisibility'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('available', 'busy', 'retired'),
        defaultValue: 'available',
        allowNull: false
      },
      missions_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('heroes');
    // Usunięcie ENUM z bazy PostgreSQL (wymagane przy cofaniu migracji)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_heroes_power";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_heroes_status";');
  }
};
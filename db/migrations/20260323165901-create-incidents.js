'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incidents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      level: {
        type: Sequelize.ENUM('low', 'medium', 'critical'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open', 'assigned', 'resolved'),
        defaultValue: 'open',
        allowNull: false
      },
      hero_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'heroes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('incidents');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_incidents_level";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_incidents_status";');
  }
};
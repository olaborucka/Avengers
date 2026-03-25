'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Incident extends Model {
    static associate(models) {
        this.belongsTo(models.Hero, { foreignKey: 'hero_id', as: 'hero' });
    }
  } 
  Incident.init({
        location: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        district: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        level: {
            type: DataTypes.ENUM('low', 'medium', 'critical'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('open', 'assigned', 'resolved'),
            defaultValue: 'open',
            allowNull: false
        },
        hero_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'heroes',
                key: 'id'            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        assigned_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
  }, {
    sequelize,
    modelName: 'Incident',
    tableName: 'incidents',
    underscored: true,
    hooks: {
      afterUpdate: async (incident, options) => {
        if (incident.changed('status') && incident.status === 'resolved' && incident.previous('status') === 'assigned') {
          const hero = await incident.getHero({ transaction: options.transaction });
          
          if (hero) {

            await hero.increment('missions_count', { by: 1, transaction: options.transaction });

          }
        }
      }
    }
  });
  
  return Incident;
};
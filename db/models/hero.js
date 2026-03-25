'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hero extends Model {
    static associate(models) {
      this.hasMany(models.Incident, { foreignKey: 'hero_id', as: 'incidents' });
    }
  }
  
  Hero.init({
    name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true
    },
    power: {
        type: DataTypes.ENUM('flight', 'strength', 'telepathy', 'speed', 'invisibility'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'busy', 'retired'),
        defaultValue: 'available',
        allowNull: false
    },
    missions_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 }
    }
  }, {
    sequelize,
    modelName: 'Hero',
    tableName: 'heroes',
    underscored: true,
    hooks: {
      beforeValidate: (hero) => {
        if (hero.name) {
          hero.name = hero.name.trim();
        }
        }
    },
    scopes: {
      //available, withPower(power), withMissions
        available: {
            where: { status: 'available' }
        },
        withPower(power) {
            return {
                where: { power }
            };
        },
        withMissions: {
            order: [['missions_count', 'DESC']]
        }
    }
  });
  
  return Hero;
};
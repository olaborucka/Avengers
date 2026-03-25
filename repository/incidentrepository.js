const { Incident, Hero } = require('../db/models');
const { Op } = require('sequelize');

const findAll = async ({ level, status, district, page = 1, pageSize = 10 } = {}) => {
    const limit = Math.min(parseInt(pageSize, 10), 50);
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * limit;

    const options = {
        where: {},
        limit,
        offset,
        order: [['id', 'DESC']]
    };

    if (level) options.where.level = level;
    if (status) options.where.status = status;
    
    if (district) {
        options.where.district = { [Op.iLike]: `%${district}%` };
    }

    const { count, rows } = await Incident.findAndCountAll(options);

    return {
        data: rows,
        pagination: {
            page: parseInt(page, 10),
            pageSize: limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        }
    };
};

const findById = async (id, trx) => {
    return await Incident.findByPk(id, {
        include: [{ model: Hero, as: 'hero' }],
        transaction: trx,
        lock: !!trx
    });
};

const create = async ({ location, level }) => {
    return await Incident.create({ location, level });
};

const assignHeroToIncident = async (incidentId, heroId, trx) => {
    const incident = await Incident.findByPk(incidentId, { transaction: trx, lock: true });
    const hero = await Hero.findByPk(heroId, { transaction: trx, lock: true });
    await hero.update({ status: 'busy' }, { transaction: trx });
    await incident.update({ hero_id: heroId, status: 'assigned', assigned_at: new Date() }, { transaction: trx });
};

const resolveIncident = async (incidentId, heroId, trx) => {
    const incident = await Incident.findByPk(incidentId, { transaction: trx, lock: true });
    const hero = await Hero.findByPk(heroId, { transaction: trx, lock: true });
    await hero.update({ status: 'available' }, { transaction: trx });

    await incident.update({ status: 'resolved', resolved_at: new Date() }, { transaction: trx });
};


const findByHeroId = async (heroId, { page = 1, pageSize = 10 } = {}, trx) => {
    const limit = Math.min(parseInt(pageSize, 10), 50);
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * limit;

    const { count, rows } = await Incident.findAndCountAll({
        where: { hero_id: heroId },
        limit,
        offset,
        order: [['assigned_at', 'DESC']],
        transaction: trx
    });

    return {
        data: rows,
        pagination: { page: parseInt(page, 10), pageSize: limit, total: count, totalPages: Math.ceil(count / limit) }
    };
};

module.exports = { findAll, findById, create, assignHeroToIncident, resolveIncident, findByHeroId };
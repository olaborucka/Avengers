const { Hero } = require('../db/models');

const findAll = async ({ power, status, sort, page = 1, pageSize = 10 } = {}) => {
    // Paginacja i filtrowanie
    const limit = Math.min(parseInt(pageSize, 10), 50);
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * limit;

    const options = {
        where: {},
        limit,
        offset,
        order: []
    };

    if (power) options.where.power = power;

    let modelToUse = Hero;
    if (status === 'available') {
        modelToUse = Hero.scope('available');
    } else if (status) {
        options.where.status = status;
    }

    // Sortowanie
    const allowedSorts = ['name', 'missions_count', 'created_at'];
    if (sort && allowedSorts.includes(sort)) {
        options.order.push([sort, 'ASC']);
    } else {
        options.order.push(['id', 'ASC']);
    }

    const { count, rows } = await modelToUse.findAndCountAll(options);
    
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
    return await Hero.findByPk(id, { transaction: trx });

};

const create = async ({ name, power }) => {
    return await Hero.create({ name, power });
};

const update = async (id, data, trx) => {
    const hero = await Hero.findByPk(id, { transaction: trx });
    if (!hero) {
        throw new Error('Hero not found');
    }
    return await hero.update(data, { transaction: trx });
};

module.exports = { findAll, findById, create, update };
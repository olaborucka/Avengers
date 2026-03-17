// Zmieniamy import na naszego Knexa
const db = require('../db/knex');

const findAll = async ({ level, status, district, page = 1, pageSize = 10 } = {}) => {
    let query = db('incidents').select('*');

    if (level) query = query.where({ level });
    if (status) query = query.where({ status });
    if (district) query = query.where('district', 'ilike', `%${district}%`);

    query = query.orderBy('id', 'desc');

    const limit = Math.min(parseInt(pageSize, 10), 50);
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * limit;

    // TUTAJ POPRAWKA: dodane .clearOrder()
    const countQuery = query.clone().clearSelect().clearOrder().count('* as total').first();
    const dataQuery = query.limit(limit).offset(offset);

    const [totalResult, data] = await Promise.all([countQuery, dataQuery]);
    const total = parseInt(totalResult.total, 10);

    return {
        data,
        pagination: {
            page: parseInt(page, 10),
            pageSize: limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const create = async ({ location, level }) => {
    const [incident] = await db('incidents')
        .insert({ location, level })
        .returning('*');
        
    return incident;
};


const findById = async (id, trx = db) => {
    return await trx('incidents').where({ id }).first();
};

const assignHeroToIncident = async (incidentId, heroId, trx) => {
    await trx('heroes').where({ id: heroId }).update({ status: 'busy' });
    await trx('incidents').where({ id: incidentId }).update({ 
        hero_id: heroId, 
        status: 'assigned',
        assigned_at: db.fn.now() 
    });
};

const resolveIncident = async (incidentId, heroId, trx) => {
    await trx('heroes').where({ id: heroId }).update({ status: 'available' }).increment('missions_count', 1);
    await trx('incidents').where({ id: incidentId }).update({ 
        status: 'resolved',
        resolved_at: db.fn.now() 
    });
};

const findByHeroId = async (heroId, { page = 1, pageSize = 10 } = {}, trx = db) => {
    let query = trx('incidents').where({ hero_id: heroId }).orderBy('assigned_at', 'desc');
    
    const limit = Math.min(parseInt(pageSize, 10), 50);
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * limit;

    const countQuery = query.clone().clearSelect().clearOrder().count('* as total').first();
    const dataQuery = query.limit(limit).offset(offset);

    const [totalResult, data] = await Promise.all([countQuery, dataQuery]);
    
    return {
        data,
        pagination: {
            page: parseInt(page, 10),
            pageSize: limit,
            total: parseInt(totalResult.total, 10),
            totalPages: Math.ceil(parseInt(totalResult.total, 10) / limit)
        }
    };
};

// ZMIEŃ OSTATNIĄ LINIJKĘ NA TĘ:
module.exports = { findAll, create, findById, assignHeroToIncident, resolveIncident, findByHeroId };

// Zmieniamy import bazy na naszego Knexa!
const db = require('../db/knex');

const findAll = async ({ power, status, sort, page = 1, pageSize = 10 } = {}) => {
    let query = db('heroes').select('id', 'name', 'power', 'status', 'missions_count', 'created_at');

    if (power) query = query.where({ power });
    if (status) query = query.where({ status });

    const allowedSorts = ['name', 'missions_count', 'created_at'];
    if (sort && allowedSorts.includes(sort)) {
        query = query.orderBy(sort, 'asc');
    } else {
        query = query.orderBy('id', 'asc');
    }

    const limit = Math.min(parseInt(pageSize, 10), 50);
    const offset = (Math.max(parseInt(page, 10), 1) - 1) * limit;

    // TUTAJ POPRAWKA: dodane .clearOrder() żeby baza nie panikowała przy liczeniu
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

const findById = async (id, trx = db) => {
    return await trx('heroes').where({ id }).first();
};
const create = async ({ name, power }) => {
    // Zamiast 'INSERT INTO...' używamy .insert()
    const [hero] = await db('heroes')
        .insert({ name, power })
        .returning('*'); // Zwracamy wszystkie kolumny nowo utworzonego bohatera
        
    return hero;
};

const update = async (id, data, trx = db) => {
    // Aktualizujemy dane i zwracamy zaktualizowany wiersz
    const [updated] = await trx('heroes').where({ id }).update(data).returning('*');
    return updated;
};

// ZMIEŃ OSTATNIĄ LINIJKĘ NA TĘ (aby wyeksportować nową funkcję):
module.exports = { findAll, findById, create, update };


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1. Tabela heroes
    await knex.schema.createTable('heroes', function(table) {
        table.increments('id');
        table.string('name').unique().notNullable();
        table.enu('power', ['flight', 'strength', 'telepathy', 'speed', 'invisibility']).notNullable();
        table.enu('status', ['available', 'busy', 'retired']).notNullable().defaultTo('available');
        
        table.timestamps(true, true);
    });

    // 2. Tabela incidents
    await knex.schema.createTable('incidents', function(table) {
        table.increments('id');
        table.string('location').notNullable();
        table.enu('level', ['low', 'medium', 'critical']).notNullable();
        table.enu('status', ['open', 'assigned', 'resolved']).notNullable().defaultTo('open');
        
        table.integer('hero_id')
            .unsigned()
            .references('id')
            .inTable('heroes')
            .onDelete('SET NULL');
            
        table.timestamps(true, true);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('incidents');
    await knex.schema.dropTable('heroes');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


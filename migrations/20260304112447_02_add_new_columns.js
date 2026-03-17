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
        
        // Tutaj doklejone defaultTo('available')
        table.enu('status', ['available', 'busy', 'retired']).notNullable().defaultTo('available');
        
        table.timestamps(true, true);
    });

    // 2. Tabela incidents
    await knex.schema.createTable('incidents', function(table) {
        table.increments('id');
        table.string('location').notNullable();
        table.enu('level', ['low', 'medium', 'critical']).notNullable();
        
        // Tutaj doklejone defaultTo('open')
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
    // Odwrotna kolejność usuwania! Najpierw incidents, potem heroes.
    await knex.schema.dropTable('incidents');
    await knex.schema.dropTable('heroes');
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = async function(knex) {
    // Cofanie zmian (odwrotna kolejność)
    await knex.schema.alterTable('incidents', function(table) {
        table.dropColumn('resolved_at');
        table.dropColumn('assigned_at');
        table.dropColumn('district');
    });

    await knex.schema.alterTable('heroes', function(table) {
        table.dropColumn('missions_count');
    });
};

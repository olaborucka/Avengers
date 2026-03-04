/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1. Dodajemy nową kolumnę do tabeli heroes
    await knex.schema.alterTable('heroes', function(table) {
        table.integer('missions_count').notNullable().defaultTo(0);
    });

    // 2. Dodajemy nowe kolumny do tabeli incidents
    await knex.schema.alterTable('incidents', function(table) {
        table.string('district').nullable();
        table.timestamp('assigned_at').nullable();
        table.timestamp('resolved_at').nullable();
    });
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

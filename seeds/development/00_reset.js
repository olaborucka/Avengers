exports.seed = async function(knex) {
  // Usuwa dane w odpowiedniej kolejności (najpierw klucz obcy)
  await knex('incidents').del();
  await knex('heroes').del();
};
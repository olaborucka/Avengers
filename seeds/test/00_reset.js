exports.seed = async function(knex) {
  // Czyści bazę testową przed testami
  await knex('incidents').del();
  await knex('heroes').del();
};
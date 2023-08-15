/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('movie_notes', table => {
      table.increments('id').primary();
      table.string('titulo_do_filme').notNullable();
      table.text('descricao_do_filme');
      table.decimal('nota').notNullable();
      table.integer('id_do_usuario').references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
      table.timestamp('data_de_edicao').defaultTo(knex.fn.now());
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('movie_notes');
};

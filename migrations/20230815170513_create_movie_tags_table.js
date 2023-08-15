/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('movie_tags', table => {
      table.increments('id').primary();
      table.string('nome_da_tag').notNullable();
      table.integer('id_da_anotacao').references('id').inTable('movie_notes').onDelete('CASCADE');
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
    return knex.schema.dropTable('movie_tags');
};

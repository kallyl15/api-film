/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('nome_do_usuario').notNullable();
      table.string('email_do_usuario').unique().notNullable();
      table.string('senha_do_usuario').notNullable();
      table.string('avatar_do_usuario');
      table.timestamp('data_de_criacao').defaultTo(knex.fn.now());
      table.timestamp('data_de_edicao').defaultTo(knex.fn.now());
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };

'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('favorites', table => {
    table.increments();
    table.integer('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('cascade')
      .index()
    table.integer('show_id')
      .notNullable()
      .references('shows.id')
      .onDelete('cascade')
      .index()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites')
};

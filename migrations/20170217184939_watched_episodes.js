'use strict'

exports.up = function(knex) {
  return knex.schema.createTable('watched_episodes', table => {
    table.increments();
    table.integer('episode_id')
      .references('episodes.id')
      .onDelete('cascade')
      .notNullable()
    table.integer('user_id')
      .references('users.id')
      .onDelete('cascade')
      .notNullable()
      .index()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('watched_episodes')
};

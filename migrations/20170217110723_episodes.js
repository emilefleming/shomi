'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('episodes', table => {
    table.increments();
    table.integer('show_id').notNullable().index();
    table.integer('tvdb_id').notNullable().unique().index();
    table.integer('absolute_number');
    table.integer('aired_episode_number');
    table.integer('aired_season');
    table.integer('aired_season_id');
    table.integer('dvd_episode_number');
    table.integer('dvd_season');
    table.integer('last_updated');
    table.string('language');
    table.string('episode_name').notNullable();
    table.string('first_aired').notNullable();
    table.text('overview');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('episodes');
};

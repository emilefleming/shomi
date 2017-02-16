
exports.up = function(knex) {
  return knex.schema.createTable('shows', (table) => {
    table.increments();
    table.integer('tvdb_id').notNullable();
    table.string('series_name').notNullable();
    table.string('network');
    table.string('first_aired');
    table.string('poster_url');
    table.string('status');
    table.text('overview');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('shows');
};

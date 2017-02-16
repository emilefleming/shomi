exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([{id: 1}, {id: 2}, {id: 3}])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};

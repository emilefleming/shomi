'use strict';

exports.seed = function(knex, Promise) {
  return knex('favorites').del()
    .then(function () {
      return knex('favorites').insert([
        {
          id: 1,
          show_id: '1',
          user_id: '1'
        },
        {
          id: 2,
          show_id: '4',
          user_id: '1'
        },
        {
          id: 3,
          show_id: '1',
          user_id: '2'
        },
      ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));"
      );
    });
};

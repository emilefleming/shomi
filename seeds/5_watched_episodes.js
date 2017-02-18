'use strict';

exports.seed = function(knex) {
  return knex('watched_episodes').del()
    .then(function () {
      return knex('watched_episodes').insert([
        {
          id: 1,
          episode_id: 7,
          user_id: 1
        },
        {
          id: 2,
          episode_id: 8,
          user_id: 1
        },
        {
          id: 3,
          episode_id: 9,
          user_id: 2
        },
      ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('watched_episodes_id_seq', (SELECT MAX(id) FROM watched_episodes));"
      );
    })
};

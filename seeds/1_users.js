exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
          id: 1,
          username: 'emile',
          email: 'emile.fleming@gmail.com',
          hashed_password: '$2a$12$i.bFhnaoRY9n86.6eabrK.DICXmu1CDyvYmwo.cnBn51UISeBTOIq'
        },
        {
          id: 2,
          username: 'billy',
          email: 'billy.fleming@gmail.com',
          hashed_password: '$2a$12$i.bFhnaoRY9n86.6eabrK.DICXmu1CDyvYmwo.cnBn51UISeBTOIq'
        },
        {
          id: 3,
          username: 'bob',
          email: 'bob.fleming@gmail.com',
          hashed_password: '$2a$12$i.bFhnaoRY9n86.6eabrK.DICXmu1CDyvYmwo.cnBn51UISeBTOIq'
        }
      ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};

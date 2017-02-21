const router = require('express').Router();
const knex = require('../../knex');

router.post('/watch/:userId', (req, res, next) => {
  const episodes = req.body.map( episode => {
    return {
      episode_id: episode,
      user_id: req.params.userId
    }
  });

  knex('watched_episodes')
    .insert(episodes, '*')
    .then( rows => {
      res.send(rows);
    })
})

router.delete('/watch/:userId', (req, res, next) => {
  knex('watched_episodes')
    .del('*')
    .whereIn('episode_id', req.body)
    .andWhere('user_id', req.params.userId)
    .then( rows => {
      res.send(rows);
    })
    .catch( err => { console.log(err)})
})

module.exports = router;

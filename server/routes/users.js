'use strict'

const router = require('express').Router();
const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const ev = require('express-validation');
const knex = require('../../knex')

const { camelizeKeys, decamelizeKeys } = require('humps');
const validations = require('../validations/users');

const authorize = (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'))
    }

    req.claim = payload;

    next();
  })
}

router.get('/', authorize, (req, res, next) => {
  console.log(req.claim);
  knex('users')
    .where('id', req.claim.userId)
    .first()
    .then( row => {
      const user = camelizeKeys(row);
      delete user.hashedPassword;
      res.send(user);
    })
    .catch(err => next(err))
})

router.post('/', ev(validations.post), (req, res, next) => {
  if (req.body.password !== req.body.verifyPassword) {
    return next(boom.create(400, 'Passwords do not match.'))
  }

  knex('users')
    .where('email', req.body.email)
    .first()
    .then( row => {
      if (row) {
        throw boom.create(400, 'Email is already registered');
      }

      return knex('users')
        .where('username', req.body.username)
        .first();
    })
    .then( row => {
      if (row) {
        throw boom.create(400, 'Username is taken');
      }

      return bcrypt.hash(req.body.password, 12);
    })
    .then( hashedPassword => {
      const user = {
        hashedPassword,
        username: req.body.username,
        email: req.body.email
      }

      return knex('users')
        .insert(decamelizeKeys(user), '*');
    })
    .then( users => {
      const user = camelizeKeys(users[0])
      const payload = {
        userId: user.id
      }

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '365 days'
      })

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
        secure: router.get('env') === 'production'
      })

      delete user.hashedPassword;
      res.send(user);
    })
    .catch(err => next(err));

})

module.exports = router;

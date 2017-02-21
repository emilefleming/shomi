'use strict';

const router = require('express').Router()
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const knex = require('../../knex');
const { camelizeKeys } = require('humps');

router.post('/', (req, res, next) => {
  let user;
  const { email, password } = req.body;

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
      const payload = {
        userId: user.id
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '365 days'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        secure: router.get('env') === 'production'
      });

      delete user.hashedPassword;

      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch(err => next(err));
});

router.delete('/', (_req, res, _next) => {
  res.clearCookie('token');
  res.end();
});

module.exports = router;

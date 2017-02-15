'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/tomorrow-tv'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};

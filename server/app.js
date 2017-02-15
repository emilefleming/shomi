const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');

require('dotenv').config()

app.use(morgan('dev'));

app.use('/api', require('./routes/api'))

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;

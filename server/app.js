const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.disable('x-powered-by');

require('dotenv').config()
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/favorites', require('./routes/favorites'))
app.use('/api/search', require('./routes/search'))

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;

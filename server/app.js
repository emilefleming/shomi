const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.disable('x-powered-by');

require('dotenv').config()
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/favorites', require('./routes/favorites'))
app.use('/api/search', require('./routes/search'))
app.use('/api/episodes', require('./routes/episodes'))
app.use('/api/users', require('./routes/users'))
app.use('/api/token', require('./routes/token'))

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res
      .status(err.status)
      .send(err);
  }

  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  console.error(err.stack);
  res.sendStatus(500);
});

module.exports = app;

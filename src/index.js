const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.post('/', (req, res) => {
  res.send('todo');
});

app.post('*', (req, res) => {
  res.status(404);
  res.send('Not Found');
});

exports.handler = serverless(app);

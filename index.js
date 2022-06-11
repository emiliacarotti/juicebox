/// this main application file will use functions from db/index.js
/// it will also listen to the front-end code making AJAX requests to certain routes
/// and make our own requests to the database

const PORT = 3000;
const express = require('express');
const server = express();

const apiRouter = require('./api');
server.use('/api', apiRouter);

// morgan and json stuff
const morgan = require('morgan');
server.use(morgan('dev'));
server.use(express.json())


const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

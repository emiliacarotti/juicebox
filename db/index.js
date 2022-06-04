// import the pg module
const { Client } = require('pg');

// supply the db name and location of the data base
const client = new Client('postgres://localhost:5432/juicebox-dev'); // 
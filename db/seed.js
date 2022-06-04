// grab our client by destructuring from the export line in db/index.js
const { client } = require("./index");

async function testDB() {
  try {
    // first we connect the client to the database
    client.connect();

    // queries are promises, so we can await them
    // here we store the result of the below SQL query command into the variable 'result'
    const result = await client.query(`SELECT * FROM users;`);

    // for now, logging is a fine way to see what's up:
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    // it's important to close out the client connection
    client.end();
  }
}

testDB();
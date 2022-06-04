// grab our client and all functions by destructuring from the export line in db/index.js
const { get } = require("express/lib/response");
const { client, getAllUsers, createUser } = require("./index");

// function to test DB
async function testDB() {
  try {
    // we can start making command requests

    // queries are promises, so we can await them

    // here we store the result of the below SQL query command into the variable 'result'. console log to see what's up
    // const result = await client.query(`SELECT * FROM users;`);
    // console.log(result);

    // const { rows } = await client.query(`SELECT * FROM users;`);
    // console.log("rows: ", rows);

    console.log("Starting to test database...");
    const users = await getAllUsers();
    console.log("getAllUsers:", users);
    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
  }
}

// function to call a query which drops all tables from the DB
async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`DROP TABLE IF EXISTS users;`);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// function to call a query which creates all tables for the DB
async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL);`);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error; // we pass the error up to the function that calls createTables
  }
}

// attempt to create a few users
async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      const albert = await createUser({ username: 'albert', password: 'bertie99' });
      const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });
      const glamgal = await createUser({ username: 'glamgal', password: 'soglam' });
     

      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  



// call all functions w/ execute
async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    //   await createInitialPets();
    //   await createInitialVets();
  } catch (error) {
    console.log("Error while rebuilding database, oh nose!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

/// in general, this db/index.js file should provide the utility functions that the rest of our appliation will use
/// we will call them from the db/seed.js file, but also from the main application file

/// the below connects and acceses the database:

// import the pg module
const { Client } = require("pg");

// supply the db name and location of the data base
const client = new Client("postgres://localhost:5432/juiceboxdev");

/// now let's start building some helper functions that we might use throughout our application:

// function to get users with id & username, then export them
async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username
        FROM users;`
  );
  return rows;
}

// function to create user to use in seed.js
async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `,
      [username, password]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

// export to be able to use client access & functions n other files
module.exports = {
  client,
  getAllUsers,
  createUser,
};

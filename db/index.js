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
    `SELECT id, username, name, location, active
        FROM users;`
  );
  return rows;
}

// function to create user to use in seed.js
async function createUser({ username, password, name, location }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `,
      [username, password, name, location]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const result = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return result;
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

// grab our client and all functions by destructuring from the export line in db/index.js
const { get } = require("express/lib/response");
const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getAllTags,
  getPostsByTagName,
} = require("./index");

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

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result: ", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
    });
    console.log("Result:", updatePostTagsResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
  }
}

// function to call a query which drops all tables from the DB
async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;`);
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
                password varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
                );
                
                CREATE TABLE posts (
                  id SERIAL PRIMARY KEY,
                  "authorId" INTEGER REFERENCES users(id),
                  title varchar(255) NOT NULL,
                  content TEXT NOT NULL,
                  active BOOLEAN DEFAULT true
                );
                
                CREATE TABLE tags (
                  id SERIAL PRIMARY KEY,
                  name varchar(255) UNIQUE NOT NULL
                );
          
                CREATE TABLE post_tags (
                  "postId" INTEGER REFERENCES posts(id),
                  "tagId" INTEGER REFERENCES tags(id),
                  UNIQUE ("postId", "tagId")
                );`);
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

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "Al Bert",
      location: "Sydney, Australia",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Just Sandra",
      location: "Ain\'t Tellin\'",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Joshua",
      location: "Upper East Side",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts...");
    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      tags: ["#happy", "#youcandoanything"]
    });

    await createPost({
      authorId: sandra.id,
      title: "How does this work?",
      content: "Seriously, does this even do anything?",
      tags: ["#happy", "#worst-day-ever"]
    });

    await createPost({
      authorId: glamgal.id,
      title: "Living the Glam Life",
      content: "Do you even? I swear that half of you are posing.",
      tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
    });
    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
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
    await createInitialPosts();
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

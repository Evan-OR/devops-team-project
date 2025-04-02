import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { SQLDatabase, UserData } from "../types";

const createDatabase = async (testMode = false) => {
  const db = await open({
    filename: testMode ? ":memory:" : "./db.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      likes INTEGER DEFAULT 0,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // since createDevData() is used for having data during development, don't create if in test mode.
  if (!testMode) {
    await createDevData(db);
  }

  return db;
};

const createDevData = async (db: SQLDatabase) => {
  await db.exec(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (1, 'TestUser', 'test@example.com', 'hashedpassword')
  `);

  const tweetsExist = await db.get("SELECT COUNT(*) AS count FROM tweets");

  if (tweetsExist.count === 0) {
    await db.exec(` 
    INSERT INTO tweets (creator_id, content, created_at, likes) VALUES
    (1, 'Cool test tweet ONE', '2025-03-28 08:30:00', 0),
    (1, 'Another test tweet', '2025-03-28 09:15:00', 0),
    (1, 'Tweet THREE', '2025-03-28 09:15:00', 0)
  `);
  }
};

const insertTweet = async (
  db: SQLDatabase,
  creatorId: number,
  content: string
) => {
  return await db.get(
    `INSERT INTO tweets (creator_id, content) VALUES (?, ?)`,
    [creatorId, content]
  );
};

const getAllTweets = async (db: SQLDatabase) => {
  return await db.all(
    `SELECT tweets.*, users.username FROM tweets JOIN users ON tweets.creator_id = users.id ORDER BY created_at DESC`
  );
};

const deleteTweet = async (db: SQLDatabase, tweetId: number): Promise<void> => {
  // Execute the SQL DELETE query to remove the tweet by its id.
  await db.run("DELETE FROM tweets WHERE id = ?", [tweetId]);
};

const updateLikes = async (db: SQLDatabase, tweetId: number): Promise<void> => {
  await db.run("UPDATE tweets SET likes = likes + 1 WHERE id = ?", [tweetId]);
};

const insertNewUser = async (
  db: SQLDatabase,
  username: string,
  email: string,
  hashedPassword: string
) => {
  return await db.run(
    `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
    [username, email, hashedPassword]
  );
};

const getUserByUsername = async (
  db: SQLDatabase,
  username: string
): Promise<UserData> => {
  return (await db.get(`SELECT * FROM users WHERE username = ?`, [
    username,
  ])) as UserData;
};

export {
  createDatabase,
  insertTweet,
  getAllTweets,
  insertNewUser,
  getUserByUsername,
  deleteTweet,
  updateLikes,
};

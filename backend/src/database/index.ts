import { Database } from 'sqlite';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

type SQLDatabase = Database<sqlite3.Database, sqlite3.Statement>;

const createDatabase = async () => {
  const DB = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database,
  });

  await createTables(DB);

  return DB;
};

const createTables = async (db: SQLDatabase) => {
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
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // can change this to use env type in the future
  await createTestData(db);
};

const createTestData = async (db: SQLDatabase) => {
  await db.exec(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (1, 'TestUser', 'test@example.com', 'hashedpassword')
  `);

  const tweetsExist = await db.get('SELECT COUNT(*) AS count FROM tweets');

  if (tweetsExist.count === 0) {
    await db.exec(` 
    INSERT INTO tweets (creator_id, content, created_at) VALUES
    (1, 'Cool test tweet ONE', '2025-03-28 08:30:00'),
    (1, 'Another test tweet', '2025-03-28 09:15:00'),
    (1, 'Tweet THREE', '2025-03-28 09:15:00')
  `);
  }
};

const insertTweet = async (db: SQLDatabase, creatorId: number, content: string) => {
  return await db.get(`INSERT INTO tweets (creator_id, content) VALUES (?, ?)`, [creatorId, content]);
};

const getAllTweets = async (db: SQLDatabase) => {
  return await db.all(
    `SELECT tweets.*, users.username FROM tweets JOIN users ON tweets.creator_id = users.id ORDER BY created_at DESC`
  );
};

export { createDatabase, insertTweet, getAllTweets };

import { Database } from 'sqlite3';
import sqlite3 from 'sqlite3';

const createDatabase = () => {
  const DB = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  });

  createTables(DB);

  return DB;
};

const createTables = (db: Database) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (1, 'TestUser', 'test@example.com', 'hashedpassword')
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

// we can add the database crud logic into this file to help organise it

const insertTweet = (db: Database, creatorId: number, content: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO tweets (creator_id, content) VALUES (?, ?)`,
      [creatorId, content],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // Return ID of inserted tweet
        }
      }
    );
  });
};

const getAllTweets = (db: Database): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT tweets.*, users.username FROM tweets JOIN users ON tweets.creator_id = users.id ORDER BY created_at DESC`,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};


export { createDatabase, insertTweet, getAllTweets };

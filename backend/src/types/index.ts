import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';

export type SQLDatabase = Database<sqlite3.Database, sqlite3.Statement>;

export type UserData = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
};

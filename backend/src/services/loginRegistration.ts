import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { insertNewUser, getUserByUsername } from '../database';
import { SQLDatabase } from '../types';

const SALT_ROUNDS = 10;
const SECRET = process.env.SECRET as string;

export const registerUser = async (db: SQLDatabase, username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const { lastID } = await insertNewUser(db, username, email, hashedPassword);
  return lastID;
};

export const getUserAuthTokenAndData = async (db: SQLDatabase, username: string, password: string) => {
  const { id, email, password_hash } = await getUserByUsername(db, username);

  const isValid = await bcrypt.compare(password, password_hash);

  if (!isValid) {
    throw new Error('Invlid login creds');
  }

  return { id, email, username };
};

export const generateAuthToken = (userId: number, username: string, email: string) => {
  return jwt.sign({ userId, username, email }, SECRET);
};

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { insertNewUser, getUserByUsername } from '../database';
import { SQLDatabase } from '../types';

const SALT_ROUNDS = 10;
const SECRET = process.env.SECRET as string;

export const registerUser = async (db: SQLDatabase, username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await insertNewUser(db, username, email, hashedPassword);
};

export const getUserAuthTokenAndData = async (db: SQLDatabase, username: string, password: string) => {
  const { id, email, password_hash } = await getUserByUsername(db, username);

  const isValid = await bcrypt.compare(password, password_hash);

  if (!isValid) {
    throw new Error('Invlid login creds');
  }

  const authToken = jwt.sign({ id, email, username }, SECRET);

  return { id, email, username, authToken };
};

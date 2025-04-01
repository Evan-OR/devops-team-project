import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { SQLDatabase } from '../types';
import { createDatabase } from '../database';
import { generateAuthToken, getUserAuthTokenAndData, registerUser } from '../services/loginRegistration';

describe('Auth Tests', () => {
  const SECRET = process.env.SECRET as string;
  let db: SQLDatabase;

  const mockUserData = {
    username: 'testUser1',
    email: 'testUser1@gmail.com',
    password: 'Password123',
  };

  beforeAll(async () => {
    db = await createDatabase(true);
  });

  afterAll(async () => {
    await db.close();
  });

  describe('registerUser', () => {
    it('should create user in DB and return its inserted ID', async () => {
      const lastInsertId = await registerUser(db, mockUserData.username, mockUserData.email, mockUserData.password);

      expect(lastInsertId).toBe(1);

      const { username, email } = await db.get('Select * from users where id = 1;');

      expect(username).toBe(mockUserData.username);
      expect(email).toBe(mockUserData.email);
    });
  });

  describe('getUserAuthTokenAndData', () => {
    it('should return user data if password is correct', async () => {
      const { id, email, username } = await getUserAuthTokenAndData(db, mockUserData.username, mockUserData.password);

      expect(id).toBe(1);
      expect(username).toBe(mockUserData.username);
      expect(email).toBe(mockUserData.email);
    });

    it('should NOT return user data if password NOT correct', async () => {
      expect(async () => await getUserAuthTokenAndData(db, mockUserData.username, 'wrongPassword')).rejects.toThrow(
        'Invalid login creds'
      );
    });
  });

  describe('generateAuthToken', () => {
    it('should generate valid authToken', async () => {
      const authToken = await generateAuthToken(1, mockUserData.username, mockUserData.email);

      expect(jwt.verify(authToken, SECRET as string)).toBeTruthy();
    });
  });
});

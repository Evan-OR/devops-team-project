import request from 'supertest';
import createServer from '../services/createServer';
import { Express } from 'express';
import { SQLDatabase } from '../types';
import { createDatabase } from '../database';

describe('API Tests', () => {
  let app: Express;
  let db: SQLDatabase;

  const mockUserData = {
    username: 'testUser1',
    email: 'testUser1@gmail.com',
    password: 'Password123',
  };

  beforeAll(async () => {
    db = await createDatabase(true);
    app = await createServer(db);
  });

  afterAll(async () => {
    await db.close();
  });

  describe('/api/', () => {
    it('should return 200 status from healthCheck endpoint', async () => {
      const res = await request(app).get('/api/');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Working RN' });
    });
  });

  describe('/api/register', () => {
    it('should return 201 status and auth_token and user_data cookies', async () => {
      const res = await request(app).post('/api/register').send(mockUserData).set('Content-Type', 'application/json');

      const cookies: string[] = res.header['set-cookie'] as unknown as string[];

      const hasAuthCookie = cookies.some((c) => c.includes('auth_token'));
      const hasUserCookie = cookies.some((c) => c.includes('user_data'));

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Registration successful' });
      expect(hasAuthCookie).toBeTruthy();
      expect(hasUserCookie).toBeTruthy();
    });

    it("should return 400 status and 'Missing value' error", async () => {
      const { email, username } = mockUserData;
      const res = await request(app)
        .post('/api/register')
        .send({ email, username })
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Missing value', email, username });
    });
  });

  describe('/api/login', () => {
    it('should return 200 status and auth_token and user_data cookies if valid creds are passed', async () => {
      const { username, password } = mockUserData;
      const res = await request(app)
        .post('/api/login')
        .send({ username, password })
        .set('Content-Type', 'application/json');

      const cookies: string[] = res.header['set-cookie'] as unknown as string[];

      const hasAuthCookie = cookies.some((c) => c.includes('auth_token'));
      const hasUserCookie = cookies.some((c) => c.includes('user_data'));

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Login successful' });
      expect(hasAuthCookie).toBeTruthy();
      expect(hasUserCookie).toBeTruthy();
    });

    it("should return 400 status and 'Invlid login creds' error if invlid creds are passed", async () => {
      const { username } = mockUserData;
      const res = await request(app)
        .post('/api/login')
        .send({ username, password: '123' })
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid login creds' });
    });
  });
});

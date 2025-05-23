import 'dotenv/config';
import express, { Request, Response } from 'express';
import { insertTweet, getAllTweets, deleteTweet, updateLikes, resetDB } from '../database';
import { generateAuthToken, getUserAuthTokenAndData, registerUser } from './loginRegistration';
import { SQLDatabase } from '../types';
import path from 'path';
import cookieParser from 'cookie-parser';
import { unlink } from 'fs/promises';

const createServer = async (db: SQLDatabase) => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(path.join(__dirname, distPath)));
  app.use(express.static(distPath, { extensions: ['js', 'css'] }));

  app.get('/api', (req: Request, res: Response) => {
    res.send({ message: 'Working RN' });
  });

  app.get('/api/tweets', async (req: Request, res: Response) => {
    try {
      const tweets = await getAllTweets(db);
      res.json(tweets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tweets' });
    }
  });

  app.post('/api/tweets', async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Missing tweet content' });
      return;
    }

    let creator_id = 1;
    let username = 'TestUser';

    if (req.cookies && req.cookies.user_data) {
      try {
        const userData =
          typeof req.cookies.user_data === 'string' ? JSON.parse(req.cookies.user_data) : req.cookies.user_data;
        creator_id = userData.id || creator_id;
        username = userData.username || username;
      } catch (err) {
        console.error('Error parsing user_data cookie:', err);
      }
    }

    try {
      const tweetId = await insertTweet(db, creator_id, content);
      res.status(201).json({ id: tweetId, content, creator_id, username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post tweet' });
    }
  });

  app.delete('/api/tweets/:id', async (req: Request, res: Response) => {
    const tweetId = req.params.id;
    try {
      await deleteTweet(db, Number(tweetId));
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete tweet' });
    }
  });

  app.put('/api/tweets/:id/like', async (req: Request, res: Response) => {
    const tweetId = parseInt(req.params.id);
    try {
      await updateLikes(db, tweetId);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update likes' });
    }
  });

  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;

      if (!username || !email || !password) {
        res.status(400).json({ message: 'Missing value', username, email, password });
        return;
      }

      const id = (await registerUser(db, username, email, password)) as number;

      const authToken = generateAuthToken(id, username, email);

      res.cookie('auth_token', authToken, {
        httpOnly: true,
      });
      res.cookie(
        'user_data',
        { id, username, email },
        {
          httpOnly: true,
        }
      );

      res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const usernameParam = req.body.username;
      const passwordParam = req.body.password;

      if (!usernameParam || !passwordParam) {
        res.status(400).send({ message: 'Missing value', usernameParam, passwordParam });
        return;
      }

      const { id, username, email } = await getUserAuthTokenAndData(db, usernameParam, passwordParam);
      const authToken = generateAuthToken(id, username, email);

      res.cookie('auth_token', authToken, {
        httpOnly: true,
      });
      res.cookie(
        'user_data',
        { id, username, email },
        {
          httpOnly: true,
        }
      );

      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      if (err instanceof Error && err.message === 'Invalid login creds') {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err);
        res.status(500).json({ error: 'Failed to Login' });
      }
    }
  });

  app.get('/api/reset', async (req, res) => {
    await resetDB(db);
    res.status(200).send('DB reset');
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  return app;
};

export default createServer;

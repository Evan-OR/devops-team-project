import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createDatabase, insertTweet, getAllTweets } from './database';
import { generateAuthToken, getUserAuthTokenAndData, registerUser } from './services/loginRegistration';

(async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  const DB = await createDatabase();

  app.get('/api', (req: Request, res: Response) => {
    res.send({ message: 'Working RN' });
  });

  app.get('/api/tweets', async (req: Request, res: Response) => {
    try {
      const tweets = await getAllTweets(DB);
      res.json(tweets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tweets' });
    }
  });

  app.post('/api/tweets', async (req: Request, res: Response): Promise<void> => {
    const { content, creator_id } = req.body;

    if (!content || !creator_id) {
      res.status(400).json({ error: 'Missing content or creator_id' });
      return;
    }

    try {
      const tweetId = await insertTweet(DB, creator_id, content);
      res.status(201).json({ id: tweetId, content, creator_id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post tweet' });
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

      const userId = (await registerUser(DB, username, email, password)) as number;

      const authToken = generateAuthToken(userId, username, email);

      res.cookie('auth_token', authToken, {
        httpOnly: true,
      });
      res.cookie(
        'user_data',
        { userId, username, email },
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

      const { id, username, email } = await getUserAuthTokenAndData(DB, usernameParam, passwordParam);
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
      console.error(err);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
})();

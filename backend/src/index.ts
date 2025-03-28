import express, { Request, Response } from 'express';
import { createDatabase, insertTweet, getAllTweets } from './database';

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

  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
})();

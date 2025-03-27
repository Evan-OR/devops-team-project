import express, { Request, Response } from 'express';
import { createDatabase, insertTweet, getAllTweets} from './database';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

const DB = createDatabase();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

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

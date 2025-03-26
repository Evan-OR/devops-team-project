import express, { Request, Response } from 'express';
import { createDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

const DB = createDatabase();

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'Working RN' });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

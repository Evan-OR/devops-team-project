import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'Working RN' });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

import { createDatabase } from './database';
import createServer from './services/createServer';

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;

    const DB = await createDatabase();
    const app = await createServer(DB);

    app.listen(PORT, () => {
      console.log(`Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('App broke :( \n ERROR: ', error);
    process.exit(1);
  }
};

startServer();

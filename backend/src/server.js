import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

const bootstrap = async () => {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Backend listening on ${env.port}`);
  });
};

bootstrap();

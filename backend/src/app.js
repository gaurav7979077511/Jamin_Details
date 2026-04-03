import express from 'express';
import cors from 'cors';
import routes from './presentation/routes/index.js';

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', routes);
  app.get('/health', (_req, res) => res.json({ ok: true }));
  return app;
};

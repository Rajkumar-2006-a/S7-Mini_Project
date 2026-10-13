import express from 'express';
import 'dotenv/config';
import path from 'path';
import apiRouter from './routes';
import { getMongoClient } from './db';

async function startServer(portToTry = Number(process.env.PORT) || 4100) {
  const app = express();

  // JSON Body Parser for API requests
  app.use(express.json({ limit: '15mb' }));

  // Mount API routes FIRST
  app.use('/api', apiRouter);

  // Initialize MongoDB connection on server boot
  getMongoClient().catch(err => {
    console.warn('[MongoDB] Startup connection note:', err.message);
  });

  const clientDistPath = path.resolve(process.cwd(), 'client', 'dist');
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });

  const server = app.listen(portToTry, '0.0.0.0', () => {
    console.log(`[MedTrack API] Running on http://0.0.0.0:${portToTry}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`[MedTrack API] Port ${portToTry} is busy; retrying on ${portToTry + 1}`);
      startServer(portToTry + 1);
      return;
    }

    console.error('[MedTrack API] Failed to start server:', error);
    process.exit(1);
  });
}

startServer();

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes';
import { getMongoClient } from './db';

export const app = express();

// 1. Comprehensive CORS setup for separate frontend & backend deployment
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Preflight handler
app.options('*', cors());

// 2. Body Parser
app.use(express.json({ limit: '15mb' }));

// 3. Mount API routes on BOTH '/api' and '/'
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 4. Initialize MongoDB connection on boot
getMongoClient().catch(err => {
  console.warn('[MongoDB] Startup connection note:', err.message);
});

// 5. Fallback for static serving if running monolithically and frontend dist exists
const clientDistPath = path.resolve(process.cwd(), 'frontend', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

export default app;

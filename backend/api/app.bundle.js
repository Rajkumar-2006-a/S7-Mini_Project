// Auto-generated placeholder: This file is compiled from backend/app.ts by `npm run build` during deployment.
import express from 'express';
const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'ok', placeholder: true }));
app.get('/health', (req, res) => res.json({ status: 'ok', placeholder: true }));
export default app;


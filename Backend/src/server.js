import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { DataAccessLayer } from './dal/dataAccess.js';
import { createFeedRouter } from './routes/feed.js';
import { createSwipeRouter } from './routes/swipe.js';
import { createMatchesRouter } from './routes/matches.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__dirname);

// Initialize Express app with configuration directly
const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Initialize Data Access Layer
const dal = new DataAccessLayer(config);
await dal.initialize();

// Health check & diagnostic routes
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'coy-backend',
    user: dal.currentUserId,
    timestamp: new Date().toISOString()
  });
});

app.get(['/stats', '/api/stats'], async (req, res, next) => {
  try {
    const stats = await dal.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
});

// Reset demo state endpoint (restores initial seed profiles)
app.post(['/dev/reset', '/api/dev/reset'], async (req, res, next) => {
  try {
    console.log('[DAL] Dev reset invoked - restoring runtime.json to seed state');
    await dal.resetToSeed();
    res.json({ success: true, message: 'Runtime state successfully reset to initial seed data.' });
  } catch (err) {
    next(err);
  }
});

// Feature Routes: support both root and /api prefixed routes
const feedRouter = createFeedRouter(dal);
const swipeRouter = createSwipeRouter(dal);
const matchesRouter = createMatchesRouter(dal);

app.use(['/feed', '/api/feed'], feedRouter);
app.use(['/swipe', '/api/swipe'], swipeRouter);
app.use(['/matches', '/api/matches'], matchesRouter);

// Serve production built frontend if available
const distCandidates = [
  path.resolve(__dirname, '../../Frontend/dist'),
  path.resolve(process.cwd(), 'Frontend/dist'),
  path.resolve(__dirname, '../public')
];
const distDir = distCandidates.find((dir) => fs.existsSync(dir));

if (distDir) {
  app.use(express.static(distDir));
  
  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path === '/feed' ||
      req.path === '/swipe' ||
      req.path === '/matches' ||
      req.path === '/health' ||
      req.path === '/stats' ||
      req.path === '/dev/reset'
    ) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Serve asset folder for profile images (mounted at /app/asset)
const assetDir = path.resolve('/app/asset');
if (fs.existsSync(assetDir)) {
  app.use('/asset', express.static(assetDir));
}

// 404 Route Handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    console.error(`[Error] 500:`, err);
  }

  res.status(status).json({
    success: false,
    error: message
  });
});

// Start server directly with app.listen()
app.listen(config.port, () => {
  console.log(`Coy Discover Backend running on http://localhost:${config.port}`);
  console.log(`Assumed logged-in user: ${config.currentUserId}`);
  console.log(`Seed file: ${config.seedFilePath}`);
  console.log(`Runtime state file: ${config.runtimeFilePath}`);
});

import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { DataAccessLayer } from './dal/dataAccess.js';
import { createFeedRouter } from './routes/feed.js';
import { createSwipeRouter } from './routes/swipe.js';
import { createMatchesRouter } from './routes/matches.js';

export async function createApp(customConfig = {}) {
  const appConfig = { ...config, ...customConfig };
  const app = express();

  // Core Middlewares
  app.use(cors());
  app.use(express.json());

  // Initialize Data Access Layer
  const dal = new DataAccessLayer(appConfig);
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

  // Development-only reset endpoint
  app.post(['/dev/reset', '/api/dev/reset'], async (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, error: 'Reset endpoint disabled in production.' });
    }
    try {
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

  // 404 Route Handler
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

  return { app, dal, config: appConfig };
}

// Auto-start server when run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  createApp()
    .then(({ app, config }) => {
      app.listen(config.port, () => {
        console.log(`🚀 Coy Discover Backend running on http://localhost:${config.port}`);
        console.log(`👤 Assumed logged-in user: ${config.currentUserId}`);
        console.log(`🌱 Seed file: ${config.seedFilePath}`);
        console.log(`💾 Runtime state file: ${config.runtimeFilePath}`);
      });
    })
    .catch((err) => {
      console.error('Fatal initialization error:', err);
      process.exit(1);
    });
}

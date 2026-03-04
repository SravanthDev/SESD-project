import express from 'express';
import cors from 'cors';
import config from './core/config.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import logger from './core/logger.js';

// Module routes
import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';
import journalRoutes from './modules/journal/journal.routes.js';
import habitRoutes from './modules/habits/habit.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';
import focusRoutes from './modules/focus/focus.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

/**
 * Express application factory — SRP: only handles HTTP layer setup.
 * Database connection is handled separately in server.js.
 */
export function createApp() {
  const app = express();

  // Global middleware
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LifeOS AI Dashboard API' });
  });

  // Module routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/journals', journalRoutes);
  app.use('/api/habits', habitRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/focus', focusRoutes);
  app.use('/api/ai', aiRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

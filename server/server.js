import { createApp } from './src/app.js';
import database from './src/core/database.js';
import config from './src/core/config.js';
import logger from './src/core/logger.js';

/**
 * Server entry point — SRP: only handles startup and shutdown.
 * App creation and database connection are delegated to their own modules.
 */
async function startServer() {
  try {
    await database.connect();

    const app = createApp();

    app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      await database.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

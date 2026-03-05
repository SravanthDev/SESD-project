import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';

/** Database connection manager — SRP: only handles MongoDB lifecycle */
class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const uri = `${config.mongo.url}/${config.mongo.dbName}`;
      this.connection = await mongoose.connect(uri);
      logger.info('✅ MongoDB Connected');
      return this.connection;
    } catch (error) {
      logger.error('❌ MongoDB Connection Error:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      logger.info('MongoDB Disconnected');
    }
  }
}

export default new Database();

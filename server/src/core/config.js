import dotenv from 'dotenv';

dotenv.config();

/** Centralized configuration — single source of truth for all env vars */
const config = Object.freeze({
  port: parseInt(process.env.PORT, 10) || 8001,
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || 'lifeos_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'lifeos-secret-key-change-in-production',
    expiresIn: '30d',
  },
  cors: {
    origin: process.env.CORS_ORIGINS || '*',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: 'llama-3.3-70b-versatile',
  },
});

export default config;

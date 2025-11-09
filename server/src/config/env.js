import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:4000',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ecommerce-test',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Cache
  cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10),

  // Query Limits
  maxQueryDepth: parseInt(process.env.MAX_QUERY_DEPTH || '10', 10),
  maxQueryComplexity: parseInt(process.env.MAX_QUERY_COMPLEXITY || '1000', 10),
};

// Validate required environment variables
if (!config.jwtSecret || config.jwtSecret.length < 32) {
  console.warn('Warning: JWT_SECRET should be at least 32 characters long');
}

export default config;



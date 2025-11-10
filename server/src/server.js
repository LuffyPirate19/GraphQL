import express from 'express';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { specifiedRules } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import connectDatabase from './config/database.js';
import { typeDefs } from './schema/typeDefs/index.js';
import { resolvers } from './schema/resolvers/index.js';
import { createContext } from './context/index.js';
import { formatError } from './utils/errors.js';
import { requestId } from './middleware/requestId.js';
import logger from './utils/logger.js';

// Create Express app
const app = express();

// CORS - MUST be before other middleware to handle preflight requests
// Normalize corsOrigin to always be an array
const allowedOrigins = Array.isArray(config.corsOrigin) 
  ? config.corsOrigin 
  : [config.corsOrigin];

// Log allowed origins on startup
logger.info(`CORS: Allowed origins: ${allowedOrigins.join(', ')}`);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      if (config.nodeEnv === 'development') {
        logger.debug(`CORS: Allowing origin ${origin}`);
      }
      callback(null, true);
    } else {
      // Log rejected origin for debugging
      logger.warn(`CORS: Origin ${origin} not allowed. Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'Accept'],
  exposedHeaders: ['X-Request-ID'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// Security middleware - configure helmet to allow CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Disable CSP to avoid conflicts with CORS
}));
app.use(compression());

// Request ID
app.use(requestId);

// Rate limiting (disabled in development, enabled in production)
if (config.nodeEnv === 'production') {
  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
  });
  app.use('/graphql', limiter);
  logger.info('Rate limiting enabled for production');
} else {
  logger.info('Rate limiting disabled for development');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Explicitly handle OPTIONS preflight requests for GraphQL
app.options('/graphql', (req, res) => {
  res.sendStatus(204);
});

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Build executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Query complexity rule
const complexityRule = createComplexityRule({
  maximumComplexity: config.maxQueryComplexity,
  estimators: [
    simpleEstimator({ defaultComplexity: 1 }),
  ],
  onComplete: (complexity) => {
    if (complexity > config.maxQueryComplexity) {
      throw new Error(`Query complexity of ${complexity} exceeds maximum allowed complexity of ${config.maxQueryComplexity}`);
    }
  },
});

// Validation rules
const validationRules = [
  depthLimit(config.maxQueryDepth),
  ...specifiedRules,
  complexityRule,
];

// GraphQL endpoint - simple and reliable direct implementation
app.all('/graphql', async (req, res) => {
  try {
    // Get query from request body (already parsed by express.json)
    const { query, variables, operationName } = req.body || {};
    
    // Handle GET requests with query parameters
    if (req.method === 'GET') {
      const getQuery = req.query.query;
      if (!getQuery) {
        return res.status(400).json({
          errors: [{ message: 'Missing query parameter' }]
        });
      }
      // Use GET query parameter
      const result = await graphql({
        schema,
        source: getQuery,
        variableValues: req.query.variables ? JSON.parse(req.query.variables) : undefined,
        operationName: req.query.operationName,
        contextValue: await createContext({ req }),
        validationRules,
      });
      return res.json(result);
    }
    
    // Handle POST requests
    if (!query) {
      return res.status(400).json({
        errors: [{ message: 'Missing query in request body' }]
      });
    }

    // Create GraphQL execution context
    const context = await createContext({ req });
    
    // Execute GraphQL query
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName: operationName,
      contextValue: context,
      validationRules,
    });

    // Format errors if any
    if (result.errors && result.errors.length > 0) {
      result.errors = result.errors.map(error => formatError(error));
      logger.error('GraphQL errors:', result.errors);
    }

    // Send response
    res.json(result);
  } catch (error) {
    logger.error('GraphQL execution error:', error);
    res.status(500).json({
      errors: [{
        message: error.message || 'Internal server error',
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      }],
    });
  }
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start Express server
    app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
      logger.info(`GraphQL endpoint: http://localhost:${config.port}/graphql`);
      logger.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
      
      if (config.nodeEnv !== 'production') {
        logger.info(`GraphiQL: http://localhost:${config.port}/graphql`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app;

import { formatError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Error handling middleware
 */
export const errorHandler = (error, req, res, next) => {
  logger.error('Error:', error);

  if (error.extensions) {
    // GraphQL error
    return res.status(error.extensions.http?.status || 500).json({
      error: {
        message: error.message,
        code: error.extensions.code,
        ...error.extensions,
      },
    });
  }

  // Generic error
  return res.status(500).json({
    error: {
      message: error.message || 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};



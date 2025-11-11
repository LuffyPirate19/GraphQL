import winston from 'winston';
import config from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let msg = `${timestamp} [${level}]: ${stack || message}`;
  
  if (Object.keys(meta).length > 0) {
    msg += ` ${JSON.stringify(meta)}`;
  }
  
  return msg;
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  defaultMeta: { service: 'ecommerce-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for development
if (config.nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

export default logger;





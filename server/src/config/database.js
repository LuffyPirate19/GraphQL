import mongoose from 'mongoose';
import config from './env.js';
import logger from '../utils/logger.js';

const connectDatabase = async () => {
  try {
    const uri = config.nodeEnv === 'test' ? config.mongodbTestUri : config.mongodbUri;
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, options);
    
    logger.info(`MongoDB connected successfully to ${uri.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export default connectDatabase;



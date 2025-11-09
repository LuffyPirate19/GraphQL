import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * Generate JWT token
 */
export const generateToken = (userId, expiresIn = config.jwtExpiresIn) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 */
export const extractToken = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};



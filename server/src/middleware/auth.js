import { verifyToken, extractToken } from '../utils/auth.js';
import User from '../models/User.js';
import { AuthenticationError } from '../utils/errors.js';

/**
 * Authentication middleware for Express
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      req.user = null;
      return next();
    }
    
    req.user = user;
    req.isAdmin = user.role === 'admin';
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

/**
 * Require authentication middleware
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

/**
 * Require admin role middleware
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};



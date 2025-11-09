import { extractToken, verifyToken } from '../utils/auth.js';
import User from '../models/User.js';
import { createLoaders } from '../loaders/index.js';

/**
 * Create GraphQL context
 */
export const createContext = async ({ req }) => {
  // Create DataLoaders
  const loaders = createLoaders();
  
  // Extract user from token
  let user = null;
  let isAdmin = false;
  
  try {
    const token = extractToken(req.headers.authorization);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.userId) {
        user = decoded.userId;
        // Load user to check role
        const userDoc = await User.findById(decoded.userId);
        if (userDoc) {
          isAdmin = userDoc.role === 'admin';
        }
      }
    }
  } catch (error) {
    // Invalid token - user remains null
    user = null;
    isAdmin = false;
  }
  
  return {
    user,
    isAdmin,
    loaders,
    req,
  };
};


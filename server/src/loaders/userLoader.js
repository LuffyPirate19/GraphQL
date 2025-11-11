import DataLoader from 'dataloader';
import User from '../models/User.js';

/**
 * Batch load users by IDs
 */
const batchUsers = async (ids) => {
  const users = await User.find({ _id: { $in: ids } }).select('-password');
  
  // Create a map for quick lookup
  const userMap = new Map();
  users.forEach((user) => {
    userMap.set(user._id.toString(), user);
  });
  
  // Return users in the same order as requested IDs
  return ids.map((id) => userMap.get(id.toString()) || null);
};

/**
 * Create a new User DataLoader
 */
export const createUserLoader = () => {
  return new DataLoader(batchUsers, {
    cacheKeyFn: (key) => key.toString(),
  });
};





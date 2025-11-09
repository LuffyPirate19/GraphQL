import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { AuthenticationError, ValidationError, ConflictError } from '../utils/errors.js';

/**
 * Register a new user
 */
export const register = async (input) => {
  const { email, password, name } = input;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Create new user
  const user = new User({
    email,
    password,
    name,
    role: 'customer',
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id.toString());

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Login user
 */
export const login = async (email, password) => {
  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id.toString());

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ValidationError('User not found');
  }
  return user.toJSON();
};



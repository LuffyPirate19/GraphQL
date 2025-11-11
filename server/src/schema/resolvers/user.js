import { login, register } from '../../services/authService.js';
import User from '../../models/User.js';
import { validate, loginSchema, registerSchema } from '../../utils/validation.js';
import { AuthenticationError } from '../../utils/errors.js';

export const userResolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      const userDoc = await User.findById(user).lean();
      if (!userDoc) {
        throw new AuthenticationError('User not found');
      }
      return {
        ...userDoc,
        id: userDoc._id.toString(),
      };
    },
  },
  
  User: {
    orders: async (parent, { filter, first, after }, { loaders, isAdmin }) => {
      // Users can only see their own orders unless admin
      const userId = isAdmin && filter?.userId ? filter.userId : parent.id;
      // Implementation would go here - simplified for now
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
          totalCount: 0,
        },
        totalCount: 0,
      };
    },
  },
  
  Mutation: {
    login: async (parent, { input }) => {
      validate(loginSchema, input);
      const { user, token } = await login(input.email, input.password);
      return { user, token };
    },
    
    register: async (parent, { input }) => {
      validate(registerSchema, input);
      const { user, token } = await register(input);
      return { user, token };
    },
  },
};





import { scalarResolvers } from './scalar.js';
import { productResolvers } from './product.js';
import { categoryResolvers } from './category.js';
import { orderResolvers } from './order.js';
import { userResolvers } from './user.js';
import { cartResolvers } from './cart.js';
import { productMutationResolvers } from './productMutations.js';

export const resolvers = {
  ...scalarResolvers,
  Query: {
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...orderResolvers.Query,
    ...userResolvers.Query,
    ...cartResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...productMutationResolvers.Mutation,
    ...categoryResolvers.Mutation,
  },
  Product: {
    ...productResolvers.Product,
  },
  Category: {
    ...categoryResolvers.Category,
  },
  Order: {
    ...orderResolvers.Order,
  },
  OrderItem: {
    ...orderResolvers.OrderItem,
  },
  User: {
    ...userResolvers.User,
  },
  Cart: {
    ...cartResolvers.Cart,
  },
  CartItem: {
    ...cartResolvers.CartItem,
  },
};




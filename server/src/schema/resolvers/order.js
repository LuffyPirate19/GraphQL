import { getOrders, getOrderById, createOrder, updateOrderStatus, buildOrderFilter } from '../../services/orderService.js';
import { getSimpleProjection } from '../../utils/projection.js';
import { createCursor, createPageInfo, hasNextPage } from '../../utils/pagination.js';
import { AuthenticationError, AuthorizationError } from '../../utils/errors.js';
import { validate, createOrderSchema, updateOrderStatusSchema } from '../../utils/validation.js';

export const orderResolvers = {
  Query: {
    orders: async (parent, { filter, first, after, limit, offset }, { user, isAdmin }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      
      const mongoFilter = buildOrderFilter(filter || {});
      const pagination = { first, after, limit, offset };
      
      const { orders, totalCount } = await getOrders(mongoFilter, pagination, user, isAdmin);
      
      const hasNext = hasNextPage(orders, limit || 10);
      const edges = orders.map((order) => ({
        node: {
          ...order,
          id: order._id.toString(),
        },
        cursor: createCursor(order),
      }));
      
      return {
        edges,
        pageInfo: createPageInfo(edges, hasNext, false, totalCount),
        totalCount,
      };
    },
    
    order: async (parent, { id }, { user, isAdmin }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      
      const order = await getOrderById(id, user, isAdmin);
      return {
        ...order,
        id: order._id.toString(),
      };
    },
  },
  
  Order: {
    user: async (parent, args, { loaders }) => {
      if (!parent.userId) return null;
      return loaders.user.load(parent.userId);
    },
    
    items: async (parent) => {
      return (parent.items || []).map((item) => ({
        ...item,
        id: item._id?.toString() || item.id,
        productId: item.productId?.toString() || item.productId,
      }));
    },
  },
  
  OrderItem: {
    product: async (parent, args, { loaders }) => {
      if (!parent.productId) return null;
      return loaders.product.load(parent.productId);
    },
  },
  
  Mutation: {
    createOrder: async (parent, { input }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      
      validate(createOrderSchema, input);
      const order = await createOrder(input, user);
      return order;
    },
    
    updateOrderStatus: async (parent, { id, status }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new AuthorizationError('Only administrators can update order status');
      }
      
      validate(updateOrderStatusSchema, { status });
      const order = await updateOrderStatus(id, status, isAdmin);
      return order;
    },
  },
};




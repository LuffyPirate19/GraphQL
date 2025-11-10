import { getCart, addToCart, removeFromCart, updateCartItem } from '../../services/cartService.js';
import { AuthenticationError } from '../../utils/errors.js';

export const cartResolvers = {
  Query: {
    cart: async (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      const cart = await getCart(user);
      return cart;
    },
  },
  
  Cart: {
    items: async (parent, args, { loaders }) => {
      if (!parent.items || parent.items.length === 0) {
        return [];
      }
      
      return parent.items.map((item) => ({
        ...item,
        id: item._id?.toString() || item.id,
        productId: item.productId?.toString() || item.productId,
      }));
    },
  },
  
  CartItem: {
    product: async (parent, args, { loaders }) => {
      if (!parent.productId) return null;
      return loaders.product.load(parent.productId);
    },
  },
  
  Mutation: {
    addToCart: async (parent, { productId, quantity }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      const cart = await addToCart(user, productId, quantity);
      return cart;
    },
    
    removeFromCart: async (parent, { productId }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      const cart = await removeFromCart(user, productId);
      return cart;
    },
    
    updateCartItem: async (parent, { productId, quantity }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      const cart = await updateCartItem(user, productId, quantity);
      return cart;
    },
  },
};




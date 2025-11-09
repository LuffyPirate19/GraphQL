import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors.js';
import mongoose from 'mongoose';

/**
 * Get orders with filtering and pagination
 */
export const getOrders = async (filter = {}, pagination = {}, userId = null, isAdmin = false) => {
  // Non-admin users can only see their own orders
  if (!isAdmin && userId) {
    filter.userId = new mongoose.Types.ObjectId(userId);
  }

  let query = Order.find(filter);

  // Apply pagination
  if (pagination.limit !== undefined) {
    const limit = pagination.limit || 10;
    const offset = pagination.offset || 0;
    query = query.skip(offset).limit(limit);
  } else {
    query = query.limit(10);
  }

  query = query.sort({ createdAt: -1 });

  const orders = await query.lean();
  const totalCount = await Order.countDocuments(filter);

  return {
    orders,
    totalCount,
  };
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId, userId = null, isAdmin = false) => {
  const order = await Order.findById(orderId).lean();
  
  if (!order) {
    throw new NotFoundError('Order');
  }

  // Check authorization
  if (!isAdmin && order.userId.toString() !== userId) {
    throw new AuthorizationError('You are not authorized to view this order');
  }

  return order;
};

/**
 * Create order from cart
 */
export const createOrder = async (input, userId) => {
  const { items, shippingAddress } = input;

  // Validate and fetch products
  const productIds = items.map((item) => new mongoose.Types.ObjectId(item.productId));
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new ValidationError('One or more products not found');
  }

  // Build order items with current prices
  const orderItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);
    
    if (!product) {
      throw new ValidationError(`Product ${item.productId} not found`);
    }

    if (!product.inStock || product.stockQuantity < item.quantity) {
      throw new ValidationError(`Product ${product.name} is out of stock or insufficient quantity`);
    }

    return {
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
      name: product.name,
    };
  });

  // Calculate total
  const total = orderItems.reduce((sum, item) => {
    const price = parseFloat(item.price.toString());
    return sum + price * item.quantity;
  }, 0);

  // Create order
  const order = new Order({
    userId: new mongoose.Types.ObjectId(userId),
    items: orderItems,
      total: new mongoose.Types.Decimal128(total.toFixed(2)),
    shippingAddress,
    status: 'pending',
  });

  await order.save();

  // Update product stock quantities
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stockQuantity: -item.quantity },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { items: [] }
  );

  return order.toJSON();
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (orderId, status, isAdmin) => {
  if (!isAdmin) {
    throw new AuthorizationError('Only administrators can update order status');
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new NotFoundError('Order');
  }

  return order.toJSON();
};

/**
 * Build order filter
 */
export const buildOrderFilter = (filter = {}) => {
  const mongoFilter = {};

  if (filter.userId) {
    mongoFilter.userId = new mongoose.Types.ObjectId(filter.userId);
  }

  if (filter.status) {
    mongoFilter.status = filter.status;
  }

  if (filter.dateRange) {
    mongoFilter.createdAt = {};
    if (filter.dateRange.from) {
      mongoFilter.createdAt.$gte = new Date(filter.dateRange.from);
    }
    if (filter.dateRange.to) {
      mongoFilter.createdAt.$lte = new Date(filter.dateRange.to);
    }
  }

  return mongoFilter;
};


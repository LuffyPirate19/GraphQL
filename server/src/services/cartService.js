import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import mongoose from 'mongoose';

/**
 * Get user's cart
 */
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  
  if (!cart) {
    // Create empty cart if it doesn't exist
    cart = new Cart({
      userId: new mongoose.Types.ObjectId(userId),
      items: [],
    });
    await cart.save();
  }

  return cart.toJSON();
};

/**
 * Add item to cart
 */
export const addToCart = async (userId, productId, quantity) => {
  // Verify product exists and is in stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError('Product');
  }

  if (!product.inStock || product.stockQuantity < quantity) {
    throw new ValidationError('Product is out of stock or insufficient quantity');
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  
  if (!cart) {
    cart = new Cart({
      userId: new mongoose.Types.ObjectId(userId),
      items: [],
    });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex >= 0) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
    });
  }

  await cart.save();
  return cart.toJSON();
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  
  if (!cart) {
    throw new NotFoundError('Cart');
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return cart.toJSON();
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  
  if (!cart) {
    throw new NotFoundError('Cart');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex < 0) {
    throw new NotFoundError('Cart item');
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  return cart.toJSON();
};


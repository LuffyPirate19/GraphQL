import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import User from '../src/models/User.js';
import Review from '../src/models/Review.js';
import Category from '../src/models/Category.js';
import config from '../src/config/env.js';

dotenv.config();

const createIndexes = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to database');

    // Create Product indexes
    console.log('Creating Product indexes...');
    await Product.collection.createIndex({ name: 'text', description: 'text' });
    await Product.collection.createIndex({ categoryId: 1, price: 1, createdAt: -1 });
    await Product.collection.createIndex({ categoryId: 1, inStock: 1, price: 1 });
    await Product.collection.createIndex({ inStock: 1, price: 1 });
    await Product.collection.createIndex({ createdAt: -1 });
    await Product.collection.createIndex({ rating: -1 });
    await Product.collection.createIndex({ categoryId: 1 });
    console.log('Product indexes created');

    // Create Order indexes
    console.log('Creating Order indexes...');
    await Order.collection.createIndex({ userId: 1, createdAt: -1 });
    await Order.collection.createIndex({ status: 1, createdAt: -1 });
    await Order.collection.createIndex({ createdAt: -1 });
    console.log('Order indexes created');

    // Create User indexes
    console.log('Creating User indexes...');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('User indexes created');

    // Create Review indexes
    console.log('Creating Review indexes...');
    await Review.collection.createIndex({ productId: 1, createdAt: -1 });
    await Review.collection.createIndex({ userId: 1 });
    await Review.collection.createIndex({ productId: 1, userId: 1 }, { unique: true });
    console.log('Review indexes created');

    // Create Category indexes
    console.log('Creating Category indexes...');
    await Category.collection.createIndex({ name: 1 });
    await Category.collection.createIndex({ slug: 1 });
    console.log('Category indexes created');

    console.log('All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();





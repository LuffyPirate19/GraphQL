import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import Review from '../src/models/Review.js';
import config from '../src/config/env.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to database');

    // Check for reset flag
    const reset = process.argv.includes('--reset');
    if (reset) {
      console.log('Resetting database...');
      await User.deleteMany({});
      await Category.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});
      await Review.deleteMany({});
      console.log('Database reset complete');
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
      },
      { upsert: true, new: true }
    );
    console.log('Admin user created:', admin.email);

    // Create customer users
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customers = [];
    for (let i = 1; i <= 5; i++) {
      const customer = await User.findOneAndUpdate(
        { email: `customer${i}@example.com` },
        {
          email: `customer${i}@example.com`,
          password: customerPassword,
          name: `Customer ${i}`,
          role: 'customer',
        },
        { upsert: true, new: true }
      );
      customers.push(customer);
      console.log('Customer created:', customer.email);
    }

    // Helper function to generate slug from name
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    };

    // Create categories
    const categoriesData = [
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Men, women, and kids clothing' },
      { name: 'Books', description: 'Fiction and non-fiction books' },
      { name: 'Home & Garden', description: 'Home decor and garden supplies' },
      { name: 'Sports', description: 'Sports equipment and apparel' },
      { name: 'Toys', description: 'Toys and games for kids' },
      { name: 'Food & Beverages', description: 'Food and drink products' },
      { name: 'Health & Beauty', description: 'Health and beauty products' },
      { name: 'Automotive', description: 'Car parts and accessories' },
      { name: 'Computers', description: 'Computers, laptops, and accessories' },
    ];

    const categories = [];
    for (const catData of categoriesData) {
      const slug = generateSlug(catData.name);
      const category = await Category.findOneAndUpdate(
        { name: catData.name },
        { ...catData, slug },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categories.push(category);
      console.log('Category created:', category.name, '(slug:', category.slug + ')');
    }

    // Create 6 products from 6 different categories
    const productsData = [
      // Electronics (Category 0)
      { 
        name: 'iPhone 15 Pro', 
        description: 'Latest iPhone with advanced features, A17 Pro chip, and Pro camera system', 
        price: 999.99, 
        categoryId: categories[0]._id, 
        stockQuantity: 50, 
        images: ['https://via.placeholder.com/300'] 
      },
      
      // Clothing (Category 1)
      { 
        name: 'Premium Cotton T-Shirt', 
        description: 'Comfortable 100% organic cotton t-shirt, perfect for everyday wear', 
        price: 29.99, 
        categoryId: categories[1]._id, 
        stockQuantity: 200, 
        images: ['https://via.placeholder.com/300'] 
      },
      
      // Books (Category 2)
      { 
        name: 'The Great Gatsby', 
        description: 'Classic American novel by F. Scott Fitzgerald, a masterpiece of American literature', 
        price: 12.99, 
        categoryId: categories[2]._id, 
        stockQuantity: 500, 
        images: ['https://via.placeholder.com/300'] 
      },
      
      // Home & Garden (Category 3)
      { 
        name: 'Decorative Plant Pot Set', 
        description: 'Set of 3 beautiful ceramic plant pots in various sizes, perfect for indoor plants', 
        price: 39.99, 
        categoryId: categories[3]._id, 
        stockQuantity: 120, 
        images: ['https://via.placeholder.com/300'] 
      },
      
      // Sports (Category 4)
      { 
        name: 'Professional Basketball', 
        description: 'Official size and weight basketball, perfect for indoor and outdoor play', 
        price: 34.99, 
        categoryId: categories[4]._id, 
        stockQuantity: 200, 
        images: ['https://via.placeholder.com/300'] 
      },
      
      // Toys (Category 5)
      { 
        name: 'LEGO Classic Creative Set', 
        description: 'Building blocks set with 790 pieces, encourages creativity and imagination', 
        price: 49.99, 
        categoryId: categories[5]._id, 
        stockQuantity: 150, 
        images: ['https://via.placeholder.com/300'] 
      },
    ];

    const products = [];
    for (const prodData of productsData) {
      const product = new Product({
        ...prodData,
        price: new mongoose.Types.Decimal128(prodData.price.toFixed(2)),
        image: prodData.images[0],
      });
      await product.save();
      products.push(product);
    }
    console.log(`Created ${products.length} products`);

    // Create some orders
    for (let i = 0; i < 10; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const orderProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
      
      const items = orderProducts.map((product) => ({
        productId: product._id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: product.price,
        name: product.name,
      }));

      const total = items.reduce((sum, item) => {
        const price = parseFloat(item.price.toString());
        return sum + price * item.quantity;
      }, 0);

      const order = new Order({
        userId: customer._id,
        items,
        total: new mongoose.Types.Decimal128(total.toFixed(2)),
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
      });
      await order.save();
    }
    console.log('Created 10 sample orders');

    // Create some reviews (avoid duplicates)
    const reviewPairs = new Set();
    let reviewsCreated = 0;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (reviewsCreated < 20 && attempts < maxAttempts) {
      const product = products[Math.floor(Math.random() * products.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const pairKey = `${product._id}-${customer._id}`;
      
      // Skip if this product-user pair already has a review
      if (reviewPairs.has(pairKey)) {
        attempts++;
        continue;
      }
      
      try {
        // Check if review already exists
        const existingReview = await Review.findOne({
          productId: product._id,
          userId: customer._id,
        });
        
        if (!existingReview) {
          const review = new Review({
            productId: product._id,
            userId: customer._id,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: `Great product! ${reviewsCreated + 1}`,
          });
          await review.save();
          reviewPairs.add(pairKey);
          reviewsCreated++;
        }
      } catch (error) {
        // Skip if duplicate key error
        if (error.code !== 11000) {
          throw error;
        }
      }
      attempts++;
    }
    console.log(`Created ${reviewsCreated} sample reviews`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();


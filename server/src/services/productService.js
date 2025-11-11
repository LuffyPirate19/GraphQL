import Product from '../models/Product.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import mongoose from 'mongoose';

/**
 * Get products with filtering, pagination, and sorting
 */
export const getProducts = async (filter = {}, pagination = {}, sort = {}, projection = {}) => {
  // Ensure name is not null or empty (required field)
  const finalFilter = {
    ...filter,
    name: { $exists: true, $ne: null, $ne: '' },
  };
  
  let query = Product.find(finalFilter, projection);

  // Apply sorting
  if (sort.sortBy) {
    const sortOptions = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      popularity_desc: { reviewCount: -1, rating: -1 },
    };
    
    const sortOption = sortOptions[sort.sortBy] || { createdAt: -1 };
    query = query.sort(sortOption);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  // Apply pagination
  if (pagination.limit !== undefined) {
    const limit = pagination.limit || 10;
    const offset = pagination.offset || 0;
    query = query.skip(offset).limit(limit);
  } else {
    query = query.limit(10);
  }

  const products = await query.lean();
  
  // Filter out any products with invalid required fields (defensive check)
  const validProducts = products.filter(product => 
    product && 
    product._id &&
    product.name && 
    typeof product.name === 'string' &&
    product.name.trim() !== '' &&
    product.price !== null &&
    product.price !== undefined
  );
  
  // Get total count of valid products (filter already excludes invalid ones at DB level)
  const totalCount = await Product.countDocuments(finalFilter);

  return {
    products: validProducts,
    totalCount,
  };
};

/**
 * Get product by ID
 */
export const getProductById = async (productId, projection = {}) => {
  const product = await Product.findById(productId, projection).lean();
  if (!product) {
    throw new NotFoundError('Product');
  }
  return product;
};

/**
 * Create product
 */
export const createProduct = async (input) => {
  // Safely process input to handle various types
  const productData = { ...input };
  
  // Convert price to Decimal128
  if (productData.price !== undefined && productData.price !== null) {
    if (productData.price instanceof mongoose.Types.Decimal128) {
      productData.price = productData.price;
    } else {
      productData.price = new mongoose.Types.Decimal128(productData.price.toString());
    }
  }
  
  // Ensure images is an array, not an object
  if (productData.images !== undefined) {
    if (Array.isArray(productData.images)) {
      // Already an array, keep it
      productData.images = productData.images.filter(img => img && typeof img === 'string');
    } else if (productData.images && typeof productData.images === 'object') {
      // Convert object to array
      try {
        // Try to convert using Object.values (safest for plain objects)
        const imageValues = Object.values(productData.images).filter(img => img && typeof img === 'string');
        productData.images = imageValues.length > 0 ? imageValues : [];
      } catch (e) {
        // If conversion fails, set to empty array
        productData.images = [];
      }
    } else {
      // Not an array or object, set to empty array
      productData.images = [];
    }
  }
  
  // Ensure categoryId is an ObjectId
  if (productData.categoryId && !(productData.categoryId instanceof mongoose.Types.ObjectId)) {
    productData.categoryId = new mongoose.Types.ObjectId(productData.categoryId);
  }
  
  const product = new Product(productData);
  
  await product.save();
  return product.toJSON();
};

/**
 * Update product
 */
export const updateProduct = async (productId, input) => {
  const updateData = { ...input };
  
  // Convert price to Decimal128 if provided
  if (updateData.price !== undefined) {
    // If already a Decimal128, use it directly
    if (updateData.price instanceof mongoose.Types.Decimal128) {
      // Already correct type, no conversion needed
    } else if (typeof updateData.price === 'string' || typeof updateData.price === 'number') {
      // Convert string or number to Decimal128
      const priceValue = typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price;
      if (isNaN(priceValue) || !isFinite(priceValue)) {
        throw new ValidationError('Price must be a valid number');
      }
      updateData.price = new mongoose.Types.Decimal128(updateData.price.toString());
    } else {
      throw new ValidationError(`Invalid price type: expected string or number, got ${typeof updateData.price}`);
    }
  }
  
  const product = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!product) {
    throw new NotFoundError('Product');
  }
  
  return product.toJSON();
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new NotFoundError('Product');
  }
  return { success: true };
};

/**
 * Build product filter from GraphQL filter input
 */
export const buildProductFilter = (filter = {}) => {
  const mongoFilter = {};

  if (filter.categoryIds && filter.categoryIds.length > 0) {
    mongoFilter.categoryId = { $in: filter.categoryIds.map(id => new mongoose.Types.ObjectId(id)) };
  }

  if (filter.priceRange) {
    mongoFilter.price = {};
    if (filter.priceRange.min !== undefined) {
      mongoFilter.price.$gte = new mongoose.Types.Decimal128(filter.priceRange.min.toString());
    }
    if (filter.priceRange.max !== undefined) {
      mongoFilter.price.$lte = new mongoose.Types.Decimal128(filter.priceRange.max.toString());
    }
  }

  if (filter.inStock !== undefined) {
    mongoFilter.inStock = filter.inStock;
  }

  if (filter.search) {
    mongoFilter.$text = { $search: filter.search };
  }

  // Handle AND/OR combinators
  if (filter.AND && filter.AND.length > 0) {
    mongoFilter.$and = filter.AND.map(buildProductFilter);
  }

  if (filter.OR && filter.OR.length > 0) {
    mongoFilter.$or = filter.OR.map(buildProductFilter);
  }

  return mongoFilter;
};


import DataLoader from 'dataloader';
import Product from '../models/Product.js';

/**
 * Batch load products by IDs
 */
const batchProducts = async (ids) => {
  const products = await Product.find({ _id: { $in: ids } });
  
  // Create a map for quick lookup
  const productMap = new Map();
  products.forEach((product) => {
    productMap.set(product._id.toString(), product);
  });
  
  // Return products in the same order as requested IDs
  return ids.map((id) => productMap.get(id.toString()) || null);
};

/**
 * Create a new Product DataLoader
 */
export const createProductLoader = () => {
  return new DataLoader(batchProducts, {
    cacheKeyFn: (key) => key.toString(),
  });
};




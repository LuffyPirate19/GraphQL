import DataLoader from 'dataloader';
import Category from '../models/Category.js';

/**
 * Batch load categories by IDs
 */
const batchCategories = async (ids) => {
  const categories = await Category.find({ _id: { $in: ids } });
  
  // Create a map for quick lookup
  const categoryMap = new Map();
  categories.forEach((category) => {
    categoryMap.set(category._id.toString(), category);
  });
  
  // Return categories in the same order as requested IDs
  return ids.map((id) => categoryMap.get(id.toString()) || null);
};

/**
 * Create a new Category DataLoader
 */
export const createCategoryLoader = () => {
  return new DataLoader(batchCategories, {
    cacheKeyFn: (key) => key.toString(),
  });
};




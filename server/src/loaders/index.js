import { createProductLoader } from './productLoader.js';
import { createCategoryLoader } from './categoryLoader.js';
import { createUserLoader } from './userLoader.js';

/**
 * Create all DataLoaders
 */
export const createLoaders = () => {
  return {
    product: createProductLoader(),
    category: createCategoryLoader(),
    user: createUserLoader(),
  };
};




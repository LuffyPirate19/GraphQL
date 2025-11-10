import Category from '../../models/Category.js';
import { getSimpleProjection } from '../../utils/projection.js';
import { NotFoundError } from '../../utils/errors.js';
import { getProducts, buildProductFilter } from '../../services/productService.js';
import { createCursor, createPageInfo, hasNextPage } from '../../utils/pagination.js';

export const categoryResolvers = {
  Query: {
    categories: async (parent, args, context, info) => {
      const projection = getSimpleProjection(info);
      const categories = await Category.find({}, projection).lean();
      return categories.map((category) => ({
        ...category,
        id: category._id.toString(),
      }));
    },
    
    category: async (parent, { id }, context, info) => {
      const projection = getSimpleProjection(info);
      const category = await Category.findById(id, projection).lean();
      if (!category) {
        throw new NotFoundError('Category');
      }
      return {
        ...category,
        id: category._id.toString(),
      };
    },
  },
  
  Category: {
    products: async (parent, { filter, first = 10, after, sort }, context, info) => {
      const mongoFilter = buildProductFilter({
        ...filter,
        categoryIds: [parent._id || parent.id],
      });
      
      const projection = getSimpleProjection(info);
      const pagination = { first, after };
      
      const { products, totalCount } = await getProducts(mongoFilter, pagination, sort || {}, projection);
      
      const hasNext = hasNextPage(products, first);
      const edges = products.map((product) => ({
        node: {
          ...product,
          id: product._id.toString(),
        },
        cursor: createCursor(product),
      }));
      
      return {
        edges,
        pageInfo: createPageInfo(edges, hasNext, false, totalCount),
        totalCount,
      };
    },
  },
  
  Mutation: {
    createCategory: async (parent, { input }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new Error('Only administrators can create categories');
      }
      
      const category = new Category(input);
      await category.save();
      return {
        ...category.toJSON(),
        id: category._id.toString(),
      };
    },
    
    updateCategory: async (parent, { id, input }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new Error('Only administrators can update categories');
      }
      
      const category = await Category.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!category) {
        throw new NotFoundError('Category');
      }
      return {
        ...category.toJSON(),
        id: category._id.toString(),
      };
    },
    
    deleteCategory: async (parent, { id }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new Error('Only administrators can delete categories');
      }
      
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new NotFoundError('Category');
      }
      return { success: true };
    },
  },
};




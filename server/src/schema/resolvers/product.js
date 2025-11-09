import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Review from '../../models/Review.js';
import { getProducts, getProductById, buildProductFilter } from '../../services/productService.js';
import { getSimpleProjection } from '../../utils/projection.js';
import { createCursor, createPageInfo, hasNextPage } from '../../utils/pagination.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Transform product to ensure all required fields are present and properly formatted
 */
const transformProduct = (product) => {
  // Convert Decimal128 price to string if needed
  let price = product.price;
  if (price && typeof price.toString === 'function') {
    price = price.toString();
  }
  
  // Ensure images is always an array of non-null strings
  let images = [];
  if (Array.isArray(product.images)) {
    images = product.images.filter(img => img && typeof img === 'string');
  }
  if (images.length === 0 && product.image && typeof product.image === 'string') {
    images = [product.image];
  }
  if (images.length === 0) {
    images = ['/placeholder.svg']; // Default placeholder
  }
  
  return {
    ...product,
    id: product._id.toString(),
    // Ensure name is always a non-empty string
    name: product.name || 'Unnamed Product',
    // Ensure price is properly converted
    price: price,
    // Ensure images is always an array of strings
    images: images,
    // Ensure rating is always a number
    rating: typeof product.rating === 'number' ? product.rating : 0,
    // Ensure reviewCount is always a number
    reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 0,
  };
};

export const productResolvers = {
  Query: {
    products: async (parent, args, context, info) => {
      const { filter, first, after, last, before, limit, offset, sort } = args;
      
      // Build MongoDB filter
      const mongoFilter = buildProductFilter(filter || {});
      
      // Get projection
      const projection = getSimpleProjection(info);
      
      // Build pagination
      const pagination = {
        first,
        after,
        last,
        before,
        limit,
        offset,
      };
      
      // Get products (already filtered by getProducts service)
      const { products, totalCount } = await getProducts(mongoFilter, pagination, sort || {}, projection);
      
      // Handle cursor pagination
      let hasNext = false;
      let hasPrev = false;
      let edges = [];
      
      if (first || last) {
        const limitValue = first || last || 10;
        hasNext = hasNextPage(products, limitValue);
        hasPrev = after !== undefined && after !== null;
        
        edges = products.map((product) => ({
          node: transformProduct(product),
          cursor: createCursor(product),
        }));
      } else {
        // Offset pagination
        edges = products.map((product) => ({
          node: transformProduct(product),
          cursor: createCursor(product),
        }));
        
        hasNext = (offset || 0) + (limit || 10) < totalCount;
        hasPrev = (offset || 0) > 0;
      }
      
      return {
        edges,
        pageInfo: createPageInfo(edges, hasNext, hasPrev, totalCount),
        totalCount,
      };
    },
    
    product: async (parent, { id }, context, info) => {
      const projection = getSimpleProjection(info);
      const product = await getProductById(id, projection);
      
      // Validate required fields
      if (!product || !product.name || product.name.trim() === '') {
        throw new NotFoundError('Product');
      }
      
      return transformProduct(product);
    },
  },
  
  Product: {
    category: async (parent, args, { loaders }) => {
      if (!parent.categoryId) return null;
      return loaders.category.load(parent.categoryId);
    },
    
    reviews: async (parent, { first = 10, after }, context, info) => {
      const query = Review.find({ productId: parent._id || parent.id })
        .sort({ createdAt: -1 })
        .limit(first + 1);
      
      if (after) {
        // Implement cursor-based pagination for reviews if needed
      }
      
      const reviews = await query.lean();
      const hasNext = reviews.length > first;
      if (hasNext) reviews.pop();
      
      const edges = reviews.map((review) => ({
        node: {
          ...review,
          id: review._id.toString(),
        },
        cursor: createCursor(review),
      }));
      
      return {
        edges,
        pageInfo: createPageInfo(edges, hasNext, false, edges.length),
        totalCount: edges.length,
      };
    },
  },
};



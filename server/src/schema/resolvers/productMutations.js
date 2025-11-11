import { createProduct, updateProduct, deleteProduct } from '../../services/productService.js';
import { validate, createProductSchema, updateProductSchema } from '../../utils/validation.js';
import { AuthorizationError } from '../../utils/errors.js';

export const productMutationResolvers = {
  Mutation: {
    createProduct: async (parent, { input }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new AuthorizationError('Only administrators can create products');
      }
      
      validate(createProductSchema, input);
      const product = await createProduct(input);
      return product;
    },
    
    updateProduct: async (parent, { id, input }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new AuthorizationError('Only administrators can update products');
      }
      
      validate(updateProductSchema, input);
      const product = await updateProduct(id, input);
      return product;
    },
    
    deleteProduct: async (parent, { id }, { user, isAdmin }) => {
      if (!user || !isAdmin) {
        throw new AuthorizationError('Only administrators can delete products');
      }
      
      const result = await deleteProduct(id);
      return result;
    },
  },
};





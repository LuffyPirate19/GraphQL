import { z } from 'zod';
import { ValidationError } from './errors.js';

/**
 * Validation schemas
 */
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  images: z.array(z.string().url()).optional(),
  image: z.string().url().optional(),
  categoryId: z.string().min(1),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  attributes: z.record(z.any()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  shippingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

/**
 * Validate data against schema
 */
export const validate = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(
        firstError.message,
        firstError.path.join('.')
      );
    }
    throw error;
  }
};



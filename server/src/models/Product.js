import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Stock quantity cannot be negative'],
    },
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Convert Decimal128 to string for JSON
        if (ret.price) {
          ret.price = ret.price.toString();
        }
        // Convert Map to object
        if (ret.attributes) {
          ret.attributes = Object.fromEntries(ret.attributes);
        }
        return ret;
      },
    },
  }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text' });

// Compound indexes for filtering and sorting
productSchema.index({ categoryId: 1, price: 1, createdAt: -1 });
productSchema.index({ categoryId: 1, inStock: 1, price: 1 });
productSchema.index({ inStock: 1, price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ rating: -1 });
productSchema.index({ categoryId: 1 });

// Update inStock based on stockQuantity
productSchema.pre('save', function (next) {
  if (this.isModified('stockQuantity')) {
    this.inStock = this.stockQuantity > 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;




import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: [0, 'Price must be positive'],
  },
  name: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },
    total: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Total is required'],
      min: [0, 'Total must be positive'],
    },
    shippingAddress: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Convert Decimal128 to string
        if (ret.total) {
          ret.total = ret.total.toString();
        }
        // Convert items price
        if (ret.items) {
          ret.items = ret.items.map((item) => ({
            ...item,
            id: item._id?.toString(),
            price: item.price?.toString(),
            _id: undefined,
          }));
        }
        // Convert ObjectId to string
        if (ret.userId) {
          ret.userId = ret.userId.toString();
        }
        return ret;
      },
    },
  }
);

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

// Calculate total before saving
orderSchema.pre('save', function (next) {
  if (this.isModified('items')) {
    const total = this.items.reduce((sum, item) => {
      const price = parseFloat(item.price.toString());
      return sum + price * item.quantity;
    }, 0);
    this.total = mongoose.Types.Decimal128.fromString(total.toFixed(2));
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;



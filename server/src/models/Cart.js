import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
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
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        // Convert ObjectId to string
        if (ret.userId) {
          ret.userId = ret.userId.toString();
        }
        // Convert items
        if (ret.items) {
          ret.items = ret.items.map((item) => ({
            ...item,
            id: item._id?.toString(),
            _id: undefined,
          }));
        }
        return ret;
      },
    },
  }
);

// Index
cartSchema.index({ userId: 1 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;



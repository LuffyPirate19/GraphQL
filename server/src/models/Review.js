import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
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
        if (ret.productId) {
          ret.productId = ret.productId.toString();
        }
        if (ret.userId) {
          ret.userId = ret.userId.toString();
        }
        return ret;
      },
    },
  }
);

// Indexes
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true }); // One review per user per product

// Update product rating and review count after save
reviewSchema.post('save', async function () {
  await updateProductRating(this.productId);
});

// Update product rating and review count after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await updateProductRating(doc.productId);
  }
});

async function updateProductRating(productId) {
  const Review = mongoose.model('Review');
  const Product = mongoose.model('Product');
  
  const reviews = await Review.find({ productId });
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount,
  });
}

const Review = mongoose.model('Review', reviewSchema);

export default Review;





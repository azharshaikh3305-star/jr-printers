import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    shadowHex: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify a product category'],
      enum: [
        'custom',
        'cups',
        'pillows',
        'bottles',
        'frames',
        'keychains',
        'mobile-covers',
        'oversized',
        'hoodies',
        'men',
        'women',
        'kids',
      ],
      index: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: [(val) => val.length > 0, 'Please provide at least one image'],
    },
    colors: {
      type: [colorSchema],
      default: [],
    },
    sizes: {
      type: [String],
      default: ['Standard'],
    },
    material: {
      type: String,
      default: 'Premium Sublimation Substrate',
    },
    weightGsm: {
      type: Number,
      default: 240,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    garmentType: {
      type: String,
      default: 'ceramic-cup',
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Search text index for full-text search across name, tagline, description
productSchema.index({ name: 'text', tagline: 'text', description: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    size: {
      type: String,
      default: 'Standard',
    },
    colorName: {
      type: String,
      default: 'Standard',
    },
    colorHex: {
      type: String,
      default: '#18181b',
    },
    garmentType: {
      type: String,
      default: 'ceramic-cup',
    },
    image: {
      type: String,
      default: '',
    },
    customDesign: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    printLocations: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestSessionId: {
      type: String,
      default: null,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    couponCode: {
      type: String,
      default: '',
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate subtotal virtual
cartSchema.virtual('subtotal').get(function () {
  return (this.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;

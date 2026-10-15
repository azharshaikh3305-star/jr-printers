import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
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
    productName: {
      type: String,
      required: true,
    },
    garmentType: {
      type: String,
      default: 'ceramic-cup',
    },
    colorName: {
      type: String,
      default: 'Standard',
    },
    colorHex: {
      type: String,
      default: '#18181b',
    },
    size: {
      type: String,
      default: 'Standard',
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    customDesign: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    designThumbnail: {
      type: String,
      default: '',
    },
    printLocations: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const refundDetailsSchema = new mongoose.Schema(
  {
    refundId: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    reason: { type: String, default: '' },
    status: { type: String, default: '' },
    refundedAt: { type: Date, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, 'Order must contain at least one item'],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard',
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay / Online UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'Pending',
        'Confirmed',
        'Processing',
        'Printing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'pending',
      index: true,
    },
    // Razorpay Integration Fields
    currency: {
      type: String,
      default: 'INR',
    },
    gatewayOrderId: {
      type: String,
      default: '',
      index: true,
    },
    paymentId: {
      type: String,
      default: '',
      index: true,
    },
    paymentSignature: {
      type: String,
      default: '',
    },
    refundDetails: {
      type: refundDetailsSchema,
      default: null,
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    estimatedDeliveryDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

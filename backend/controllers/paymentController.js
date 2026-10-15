import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Initialize Razorpay instance if keys are available
 */
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && keyId !== 'your_razorpay_key_id') {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return null;
};

/**
 * @desc    Get Razorpay Public Key ID for frontend SDK
 * @route   GET /api/payment/key
 * @access  Public
 */
export const getPaymentKey = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_JRPrintingWorksDemoKey';
  return successResponse(res, 200, 'Payment public key retrieved', {
    keyId,
    currency: 'INR',
    companyName: 'JR PRINTING WORKS',
    isTestMode: !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id',
  });
};

/**
 * @desc    Create Razorpay Order with backend-authoritative price validation
 * @route   POST /api/payment/create-order
 * @access  Public (Optional user login)
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, shippingMethod = 'standard', couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, 'Order must contain at least one item');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      return errorResponse(res, 400, 'Complete shipping address and contact phone are required');
    }

    // Backend-Authoritative Price & Product Validation:
    // DO NOT trust frontend totals! Fetch actual product prices from MongoDB database.
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      let authenticUnitPrice = 0;
      let authenticProductName = item.productName || item.name || 'Custom Printed Product';
      let authenticGarmentType = item.garmentType || 'ceramic-cup';
      let productRef = null;

      // Check if product exists in MongoDB
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        const dbProduct = await Product.findById(item.productId);
        if (dbProduct) {
          productRef = dbProduct._id;
          authenticProductName = dbProduct.name;
          authenticGarmentType = dbProduct.garmentType || authenticGarmentType;

          // Apply product discount if applicable
          if (dbProduct.discountPercent && dbProduct.discountPercent > 0) {
            authenticUnitPrice = Math.round(
              dbProduct.basePrice * (1 - dbProduct.discountPercent / 100)
            );
          } else {
            authenticUnitPrice = Number(dbProduct.basePrice);
          }
        }
      }

      // If not found by ObjectId, try searching by custom id or fallback
      if (authenticUnitPrice === 0 && item.productId) {
        const dbProductByName = await Product.findOne({
          $or: [{ name: item.name }, { name: item.productName }],
        });
        if (dbProductByName) {
          productRef = dbProductByName._id;
          authenticProductName = dbProductByName.name;
          authenticUnitPrice = Number(dbProductByName.basePrice);
        }
      }

      // If still not matched in DB (e.g., custom designer item), ensure reasonable price floor
      if (authenticUnitPrice === 0) {
        authenticUnitPrice = Number(item.unitPrice || item.price || 299);
        if (authenticUnitPrice < 49) {
          authenticUnitPrice = 49; // Strict price floor
        }
      }

      const itemTotal = authenticUnitPrice * quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: item.productId || 'custom-design',
        productRef,
        productName: authenticProductName,
        garmentType: authenticGarmentType,
        colorName: item.colorName || 'Standard',
        colorHex: item.colorHex || '#18181b',
        size: item.size || 'Standard',
        quantity,
        unitPrice: authenticUnitPrice,
        totalPrice: itemTotal,
        customDesign: item.customDesign || null,
        designThumbnail: item.designThumbnail || item.image || '',
        printLocations: item.printLocations || [],
      });
    }

    // Calculate Authentic Discount
    let discountAmount = 0;
    if (couponCode && typeof couponCode === 'string') {
      const code = couponCode.toUpperCase().trim();
      if (code === 'WELCOME10') {
        discountAmount = Math.round(calculatedSubtotal * 0.1);
      } else if (code === 'SAMEER20') {
        discountAmount = Math.round(calculatedSubtotal * 0.2);
      } else if (code === 'PRINT50') {
        discountAmount = Math.min(50, calculatedSubtotal);
      }
    }

    // Shipping cost validation (standard: free over 499 or 40, express: 99)
    let shippingCost = 0;
    if (shippingMethod === 'express') {
      shippingCost = 99;
    } else {
      shippingCost = calculatedSubtotal >= 499 ? 0 : 40;
    }

    // GST/Tax amount (Included or calculated, e.g. 0 or 5%)
    const taxAmount = 0;

    // Authentic Total in INR
    const finalTotalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingCost + taxAmount);
    const amountInPaise = Math.round(finalTotalAmount * 100);

    // Generate unique internal Order ID
    const uniqueSuffix = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `JR-${uniqueSuffix}-${randomSuffix}`;

    const razorpay = getRazorpayInstance();
    let gatewayOrderId = '';

    if (razorpay) {
      // Create Order with real Razorpay
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderId,
        payment_capture: 1, // Auto-capture payment
        notes: {
          customerName: shippingAddress.fullName,
          customerPhone: shippingAddress.phone,
          customerEmail: shippingAddress.email || '',
        },
      });
      gatewayOrderId = rzpOrder.id;
    } else {
      // Test / Fallback mock gateway order ID for development
      gatewayOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log(`ℹ️ [PAYMENT - DEV MODE] Created Mock Razorpay Gateway Order: ${gatewayOrderId} for ₹${finalTotalAmount}`);
    }

    // Save pending Order in MongoDB
    const newOrder = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      items: validatedItems,
      shippingAddress,
      shippingMethod,
      shippingCost,
      taxAmount,
      subtotal: calculatedSubtotal,
      discountAmount,
      totalAmount: finalTotalAmount,
      currency: 'INR',
      paymentMethod: 'Razorpay / Online UPI',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      gatewayOrderId,
    });

    return successResponse(res, 201, 'Payment order initialized successfully', {
      orderId: newOrder.orderId,
      gatewayOrderId,
      amount: amountInPaise,
      amountInRupees: finalTotalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_JRPrintingWorksDemoKey',
      customer: {
        name: shippingAddress.fullName,
        email: shippingAddress.email || '',
        contact: shippingAddress.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay payment signature & mark order as paid
 * @route   POST /api/payment/verify
 * @access  Public
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return errorResponse(res, 400, 'Incomplete payment response from gateway');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let isSignatureValid = false;

    // Cryptographic verification if Razorpay secret is set
    if (keySecret && keySecret !== 'your_razorpay_key_secret') {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpay_signature;

      if (!isSignatureValid) {
        // Record payment failure on order
        await Order.findOneAndUpdate(
          { $or: [{ orderId }, { gatewayOrderId: razorpay_order_id }] },
          { paymentStatus: 'failed', paymentId: razorpay_payment_id }
        );
        return errorResponse(res, 400, 'Cryptographic payment verification failed. Unauthorized or tampered transaction.');
      }
    } else {
      // In development / demo environment without keys: accept mock signatures
      isSignatureValid = true;
      console.log(`ℹ️ [PAYMENT - DEV MODE] Verified Mock Payment: ${razorpay_payment_id}`);
    }

    // Find and update the MongoDB order
    const order = await Order.findOne({
      $or: [{ orderId }, { gatewayOrderId: razorpay_order_id }],
    });

    if (!order) {
      return errorResponse(res, 404, 'Associated order not found in database');
    }

    // Idempotent update: If already paid, return existing success
    if (order.paymentStatus === 'paid' || order.paymentStatus === 'Paid') {
      return successResponse(res, 200, 'Order payment already verified and confirmed', { order });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentId = razorpay_payment_id;
    order.paymentSignature = razorpay_signature || 'mock_signature';
    order.estimatedDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await order.save();

    console.log(`✅ Order ${order.orderId} marked as PAID via paymentId ${razorpay_payment_id}`);

    return successResponse(res, 200, 'Payment verified successfully! Order is confirmed.', {
      order,
      orderId: order.orderId,
      paymentId: order.paymentId,
      amount: order.totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle Razorpay Webhook for asynchronous server-to-server updates
 * @route   POST /api/payment/webhook
 * @access  Public (HMAC Verified)
 */
export const handlePaymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];

    // Webhook verification if secret configured
    if (webhookSecret && webhookSecret !== 'your_razorpay_webhook_secret') {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== receivedSignature) {
        console.error('❌ Razorpay Webhook signature mismatch');
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`🔔 Razorpay Webhook received event: ${event}`);

    // Idempotent webhook event handling
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const gatewayOrderId = paymentEntity?.order_id || payload.order?.entity?.id;
      const paymentId = paymentEntity?.id;

      if (gatewayOrderId) {
        const order = await Order.findOne({ gatewayOrderId });
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.orderStatus = 'confirmed';
          if (paymentId) order.paymentId = paymentId;
          await order.save();
          console.log(`✅ Webhook updated order ${order.orderId} to PAID`);
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const gatewayOrderId = paymentEntity?.order_id;
      if (gatewayOrderId) {
        await Order.findOneAndUpdate(
          { gatewayOrderId, paymentStatus: { $ne: 'paid' } },
          { paymentStatus: 'failed' }
        );
      }
    }

    // Always respond 200 OK to webhook provider
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Initiate refund for an order (Admin Only)
 * @route   POST /api/payment/refund
 * @access  Private/Admin
 */
export const refundPayment = async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    if (!orderId) {
      return errorResponse(res, 400, 'Please provide orderId to initiate refund');
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'Paid') {
      return errorResponse(res, 400, `Cannot refund order with payment status: ${order.paymentStatus}`);
    }

    const refundAmount = amount ? Number(amount) : order.totalAmount;
    const razorpay = getRazorpayInstance();
    let refundId = `rfnd_mock_${Date.now()}`;

    if (razorpay && order.paymentId && !order.paymentId.startsWith('pay_mock')) {
      const refund = await razorpay.payments.refund(order.paymentId, {
        amount: Math.round(refundAmount * 100),
        notes: { reason: reason || 'Customer requested refund via admin' },
      });
      refundId = refund.id;
    }

    order.paymentStatus = 'refunded';
    order.orderStatus = 'cancelled';
    order.refundDetails = {
      refundId,
      amount: refundAmount,
      reason: reason || 'Admin initiated refund',
      status: 'processed',
      refundedAt: new Date(),
    };

    await order.save();

    return successResponse(res, 200, `Refund of ₹${refundAmount} processed successfully`, {
      orderId: order.orderId,
      refundId,
      amount: refundAmount,
      paymentStatus: 'refunded',
    });
  } catch (error) {
    next(error);
  }
};

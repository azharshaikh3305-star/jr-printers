import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Create / Place a new print order
 * @route   POST /api/orders
 * @access  Public (Guest or Authenticated User)
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      shippingMethod = 'standard',
      shippingCost = 0,
      taxAmount = 0,
      subtotal,
      discountAmount = 0,
      totalAmount,
      paymentMethod = 'UPI (GPay / PhonePe)',
      paymentStatus = 'Paid',
    } = req.body;

    if (!items || !items.length) {
      return errorResponse(res, 400, 'Order must contain at least one item');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      return errorResponse(res, 400, 'Please provide customer name, delivery address and phone number');
    }

    // Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `JR-ORD-${randomSuffix}`;

    const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0);
    const calculatedTotal = totalAmount || (calculatedSubtotal + shippingCost + taxAmount - discountAmount);

    // Create Order in MongoDB
    const order = await Order.create({
      orderId,
      user: req.user?._id || null,
      items,
      shippingAddress,
      shippingMethod,
      shippingCost,
      taxAmount,
      subtotal: calculatedSubtotal,
      discountAmount,
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Processing',
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      trackingNumber: 'Preparing Dispatch',
    });

    return successResponse(res, 201, `Order #${order.orderId} placed successfully`, { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin gets all, User gets own)
 * @route   GET /api/orders
 * @access  Private / Admin
 */
export const getOrders = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    // If user is not admin, only show their orders
    if (req.user && req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    // Status filter
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { orderId: { $regex: q, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: q, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: q, $options: 'i' } },
        { 'shippingAddress.city': { $regex: q, $options: 'i' } },
        { trackingNumber: { $regex: q, $options: 'i' } },
      ];
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    const [orders, totalCount] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
      Order.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Orders retrieved successfully', {
      orders,
      totalCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by orderId
 * @route   GET /api/orders/:orderId
 * @access  Public / Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [{ orderId: orderId.toUpperCase() }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }],
    });

    if (!order) {
      return errorResponse(res, 404, `Order #${orderId} not found`);
    }

    return successResponse(res, 200, 'Order details retrieved', { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order production/delivery status
 * @route   PATCH /api/orders/:orderId/status
 * @access  Private / Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingNumber, paymentStatus } = req.body;

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const order = await Order.findOneAndUpdate(
      { $or: [{ orderId: orderId.toUpperCase() }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }] },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!order) {
      return errorResponse(res, 404, `Order #${orderId} not found`);
    }

    return successResponse(res, 200, `Order #${order.orderId} status updated to ${order.orderStatus}`, {
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:orderId
 * @access  Private / Admin
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndDelete({
      $or: [{ orderId: orderId.toUpperCase() }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }],
    });

    if (!order) {
      return errorResponse(res, 404, `Order #${orderId} not found`);
    }

    return successResponse(res, 200, `Order #${orderId} deleted from database records`);
  } catch (error) {
    next(error);
  }
};

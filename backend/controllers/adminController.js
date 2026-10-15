import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Inquiry from '../models/Inquiry.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { initialOrders, initialInquiries } from '../data/seedData.js';

/**
 * @desc    Get Admin Dashboard Stats & Metrics
 * @route   GET /api/admin/stats
 * @access  Private / Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [orders, productsCount, inStockCount, inquiriesCount, newInquiriesCount] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Product.countDocuments(),
      Product.countDocuments({ inStock: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const activePrintingCount = orders.filter(
      (o) => o.orderStatus === 'Printing' || o.orderStatus === 'Processing'
    ).length;

    const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

    return successResponse(res, 200, 'Dashboard statistics retrieved', {
      totalRevenue,
      totalOrders: orders.length,
      activePrintingCount,
      deliveredCount,
      totalProducts: productsCount,
      inStockProducts: inStockCount,
      totalInquiries: inquiriesCount,
      newInquiriesCount,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all demo test orders & inquiries (Start live production store)
 * @route   POST /api/admin/clear-demo
 * @access  Private / Admin
 */
export const clearDemoData = async (req, res, next) => {
  try {
    await Promise.all([
      Order.deleteMany({}),
      Inquiry.deleteMany({}),
    ]);

    return successResponse(res, 200, 'All demo orders & inquiries cleared. Store is ready for live production!');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Load initial sample orders & inquiries for preview
 * @route   POST /api/admin/load-demo
 * @access  Private / Admin
 */
export const loadDemoData = async (req, res, next) => {
  try {
    await Promise.all([
      Order.deleteMany({}),
      Inquiry.deleteMany({}),
    ]);

    await Promise.all([
      Order.insertMany(initialOrders),
      Inquiry.insertMany(initialInquiries),
    ]);

    return successResponse(res, 200, 'Sample demo orders and leads reloaded successfully.');
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import {
  getPaymentKey,
  createPaymentOrder,
  verifyPayment,
  handlePaymentWebhook,
  refundPayment,
} from '../controllers/paymentController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public payment gateway configuration
router.get('/key', getPaymentKey);

// Create checkout order & initiate gateway payment
router.post('/create-order', optionalAuth, createPaymentOrder);

// Cryptographic payment response verification
router.post('/verify', verifyPayment);

// Payment Gateway Webhook
router.post('/webhook', handlePaymentWebhook);

// Admin Refund Initiation
router.post('/refund', protect, adminOnly, refundPayment);

export default router;

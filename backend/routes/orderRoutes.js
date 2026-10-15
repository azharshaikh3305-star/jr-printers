import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', optionalAuth, getOrders);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/status', protect, adminOnly, updateOrderStatus);
router.delete('/:orderId', protect, adminOnly, deleteOrder);

export default router;

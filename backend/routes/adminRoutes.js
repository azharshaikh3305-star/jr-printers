import express from 'express';
import {
  getDashboardStats,
  clearDemoData,
  loadDemoData,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.post('/clear-demo', protect, adminOnly, clearDemoData);
router.post('/load-demo', protect, adminOnly, loadDemoData);

export default router;

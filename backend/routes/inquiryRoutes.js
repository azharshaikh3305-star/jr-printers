import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, adminOnly, getInquiries);
router.patch('/:id/status', protect, adminOnly, updateInquiryStatus);
router.delete('/:id', protect, adminOnly, deleteInquiry);

export default router;

import express from 'express';
import {
  getSettings,
  updateSettings,
} from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, adminOnly, updateSettings);

export default router;

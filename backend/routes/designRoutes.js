import express from 'express';
import {
  saveDesign,
  getUserDesigns,
  deleteDesign,
} from '../controllers/designController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, saveDesign);
router.get('/', optionalAuth, getUserDesigns);
router.delete('/:id', optionalAuth, deleteDesign);

export default router;

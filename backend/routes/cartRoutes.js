import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.put('/items/:itemId', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);

export default router;

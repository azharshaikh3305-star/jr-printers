import express from 'express';
import {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getMe,
  updateProfile,
  adminLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration & Email OTP Verification
router.post('/register', register);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/resend-email-otp', resendEmailOtp);

// Standard Login & Admin PIN Login
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Forgot Password Flow with OTP
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/verify-forgot-password-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

// Protected User Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

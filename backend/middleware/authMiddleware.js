import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect routes - Verifies JWT from Authorization Bearer header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'jr_printing_works_jwt_super_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      // Attach user object to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // If DB user not found, use minimal token info for continuity
        req.user = { _id: decoded.id, role: decoded.role || 'user' };
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return errorResponse(res, 401, 'Not authorized, token invalid or expired');
    }
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no bearer token provided');
  }
};

/**
 * Admin role authorization middleware
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 403, 'Access denied: Admin privileges required');
};

/**
 * Optional authentication - attaches user if valid token exists, but doesn't block guests
 */
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'jr_printing_works_jwt_super_secret_key_2026';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Ignored for optional auth
    }
  }
  next();
};

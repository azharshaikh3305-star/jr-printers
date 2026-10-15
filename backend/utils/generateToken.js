import jwt from 'jsonwebtoken';

/**
 * Generate signed JWT token for user
 * @param {string} id - User ID
 * @param {string} role - User Role ('user' | 'admin')
 * @returns {string} Signed JWT token
 */
export const generateToken = (id, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'jr_printing_works_jwt_super_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

export default generateToken;

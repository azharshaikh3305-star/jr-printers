import { api, ApiResponse } from './api';

export interface UserAccountResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isEmailVerified?: boolean;
  avatar?: string;
  createdAt?: string;
}

export const authService = {
  /**
   * Register a new user account (triggers email verification OTP)
   */
  register: async (name: string, email: string, phone: string, password: string) => {
    return api.post<{ email: string; requiresOtp: boolean; expiresInMinutes: number; devOtp?: string }>(
      '/auth/register',
      { name, email, phone, password }
    );
  },

  /**
   * Verify registration email OTP and activate account
   */
  verifyEmailOtp: async (email: string, otp: string) => {
    const res = await api.post<{ token: string; user: UserAccountResponse }>(
      '/auth/verify-email-otp',
      { email, otp }
    );

    if (res.success && res.data?.token) {
      localStorage.setItem('jr_token', res.data.token);
      localStorage.setItem('jr_current_user', JSON.stringify(res.data.user));
    }

    return res;
  },

  /**
   * Resend email verification OTP with rate-limiting cooldown
   */
  resendEmailOtp: async (email: string) => {
    return api.post<{ email: string; expiresInMinutes: number; devOtp?: string }>(
      '/auth/resend-email-otp',
      { email }
    );
  },

  /**
   * Authenticate user with email/phone and password
   */
  login: async (emailOrPhone: string, password?: string) => {
    const res = await api.post<{
      token?: string;
      user?: UserAccountResponse;
      requiresOtp?: boolean;
      email?: string;
    }>('/auth/login', { emailOrPhone, password });

    if (res.success && res.data?.token) {
      localStorage.setItem('jr_token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('jr_current_user', JSON.stringify(res.data.user));
      }
    }

    return res;
  },

  /**
   * Request password reset OTP
   */
  forgotPassword: async (email: string) => {
    return api.post<{ email: string; expiresInMinutes: number; devOtp?: string }>(
      '/auth/forgot-password',
      { email }
    );
  },

  /**
   * Verify password reset OTP code
   */
  verifyResetOtp: async (email: string, otp: string) => {
    return api.post<{ verified: boolean; email: string }>(
      '/auth/verify-reset-otp',
      { email, otp }
    );
  },

  /**
   * Set new password with verified OTP
   */
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return api.post(
      '/auth/reset-password',
      { email, otp, newPassword }
    );
  },

  /**
   * Admin PIN verification
   */
  adminLogin: async (pin: string) => {
    const res = await api.post<{ token: string; user: UserAccountResponse }>(
      '/auth/admin-login',
      { pin }
    );

    if (res.success && res.data?.token) {
      localStorage.setItem('jr_admin_token', res.data.token);
      localStorage.setItem('jr_admin_auth', 'true');
    }

    return res;
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async () => {
    return api.get<{ user: UserAccountResponse }>('/auth/me');
  },

  /**
   * Clear local authentication tokens
   */
  logout: () => {
    localStorage.removeItem('jr_token');
    localStorage.removeItem('jr_current_user');
  },
};

export default authService;

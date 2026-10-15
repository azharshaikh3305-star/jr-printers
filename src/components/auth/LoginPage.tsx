import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    register,
    verifyEmailOtp,
    resendEmailOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    activeDevOtp,
    navigateTo,
    addToast,
  } = useApp();

  // Mode: 'login' | 'register' | 'verify-reg-otp' | 'forgot' | 'verify-reset-otp'
  const [authMode, setAuthMode] = useState<
    'login' | 'register' | 'verify-reg-otp' | 'forgot' | 'verify-reset-otp'
  >('login');

  // Login Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Fields for Email Verification
  const [regOtp, setRegOtp] = useState('');
  const [activeOtpEmail, setActiveOtpEmail] = useState('');

  // Forgot Password Fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Cooldown timer state for resending OTPs
  const [cooldown, setCooldown] = useState(0);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Standard Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      addToast('Please enter your email or WhatsApp number', 'error');
      return;
    }
    setLoading(true);
    try {
      const success = await login(emailOrPhone, password);
      if (success) {
        navigateTo('account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration -> Triggers OTP Email
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      addToast('Please fill in all registration fields', 'error');
      return;
    }
    if (regPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }
    if (!agreeTerms) {
      addToast('Please agree to Terms of Service & Privacy Policy', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await register(regName, regEmail, regPhone, regPassword);
      if (success) {
        setActiveOtpEmail(regEmail.trim().toLowerCase());
        setCooldown(60);
        setAuthMode('verify-reg-otp');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Verifying Registration OTP
  const handleVerifyRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regOtp.trim() || regOtp.trim().length !== 6) {
      addToast('Please enter the complete 6-digit OTP code', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await verifyEmailOtp(activeOtpEmail, regOtp.trim());
      if (success) {
        navigateTo('account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Resending Registration OTP
  const handleResendRegOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      const success = await resendEmailOtp(activeOtpEmail);
      if (success) {
        setCooldown(60);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Request
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await forgotPassword(forgotEmail.trim().toLowerCase());
      if (success) {
        setCooldown(60);
        setAuthMode('verify-reset-otp');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password with OTP
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp.trim() || resetOtp.trim().length !== 6) {
      addToast('Please enter the 6-digit verification code', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      addToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match. Please re-type password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await resetPassword(
        forgotEmail.trim().toLowerCase(),
        resetOtp.trim(),
        newPassword
      );
      if (success) {
        setEmailOrPhone(forgotEmail);
        setPassword('');
        setAuthMode('login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-6 sm:py-12 px-3 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 font-black text-2xl flex items-center justify-center font-display shadow-md border border-amber-300 mx-auto mb-3">
            JR
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight uppercase text-stone-900">
            JR PRINTING WORKS
          </h2>
          <span className="text-xs font-semibold text-amber-800">
            Pro. Shaikh Sameer
          </span>
        </div>

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-display font-black text-stone-900 text-center">
                Sign In to Account
              </h3>
              <p className="text-xs text-stone-500 mt-1 text-center">
                Enter your registered email address or mobile number to continue.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. alex.wright@example.com or 7888162822"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-xs font-semibold text-amber-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-stone-300 text-stone-900 focus:ring-0"
                />
                <span>Remember my device</span>
              </label>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Link to Register */}
            <div className="pt-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-amber-800 hover:text-amber-900 hover:underline inline-flex items-center gap-1 ml-1"
                >
                  <span>Create an Account / Register</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-display font-black text-stone-900 text-center">
                Create New Account
              </h3>
              <p className="text-xs text-stone-500 mt-1 text-center">
                An email OTP will be sent to activate your account securely.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address (For Verification Code)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                WhatsApp Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setRegShowPassword(!regShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-stone-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-0"
                />
                <span>
                  I agree to the Terms of Service & allow order updates on WhatsApp.
                </span>
              </label>
            </div>

            {/* Primary Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to sign in */}
            <div className="pt-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-amber-800 hover:text-amber-900 hover:underline ml-1"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 3. VERIFY REGISTRATION OTP SCREEN */}
        {authMode === 'verify-reg-otp' && (
          <form onSubmit={handleVerifyRegOtp} className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-black text-stone-900">
                Verify Your Email
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-stone-900">{activeOtpEmail}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={regOtp}
                  onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  required
                  autoFocus
                  className="w-full py-3.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-center text-2xl font-mono font-bold tracking-[0.5em] text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
              {activeDevOtp && (
                <div className="mt-2.5 bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 text-xs text-stone-800 flex items-center justify-between">
                  <span>
                    🔑 Demo Code: <strong className="font-mono text-stone-950 font-bold">{activeDevOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRegOtp(activeDevOtp)}
                    className="px-2 py-1 bg-amber-200/70 hover:bg-amber-300 text-stone-900 rounded-lg font-bold text-[11px] transition-colors"
                  >
                    Auto-fill
                  </button>
                </div>
              )}
              <p className="text-[11px] text-stone-400 mt-1.5 text-center">
                ⏱️ Code valid for 10 minutes. Check inbox and spam folder.
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || regOtp.length !== 6}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verify OTP & Activate Account</span>
                </>
              )}
            </button>

            {/* Resend Cooldown Option */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-stone-500 hover:text-stone-800 font-medium"
              >
                ← Change Email
              </button>

              <button
                type="button"
                onClick={handleResendRegOtp}
                disabled={cooldown > 0 || loading}
                className={`font-bold flex items-center gap-1 ${
                  cooldown > 0
                    ? 'text-stone-400 cursor-not-allowed'
                    : 'text-amber-800 hover:underline hover:text-amber-900'
                }`}
              >
                {cooldown > 0 ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend in {cooldown}s</span>
                  </>
                ) : (
                  <span>Resend Code</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* 4. FORGOT PASSWORD REQUEST FORM */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-display font-black text-stone-900 text-center">
                Reset Your Password
              </h3>
              <p className="text-xs text-stone-500 mt-1 text-center">
                Enter your registered email address to receive a secure password reset code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. alex.wright@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Password Reset OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* 5. VERIFY RESET OTP & ENTER NEW PASSWORD */}
        {authMode === 'verify-reset-otp' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 text-red-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-black text-stone-900">
                Set New Password
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter the code sent to{' '}
                <span className="font-semibold text-stone-900">{forgotEmail}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 text-center">
                6-Digit Reset Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                required
                autoFocus
                className="w-full py-3 bg-stone-50 border-2 border-stone-200 rounded-xl text-center text-xl font-mono font-bold tracking-[0.4em] text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
              />
              {activeDevOtp && (
                <div className="mt-2.5 bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 text-xs text-stone-800 flex items-center justify-between">
                  <span>
                    🔑 Demo Code: <strong className="font-mono text-stone-950 font-bold">{activeDevOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setResetOtp(activeDevOtp)}
                    className="px-2 py-1 bg-amber-200/70 hover:bg-amber-300 text-stone-900 rounded-lg font-bold text-[11px] transition-colors"
                  >
                    Auto-fill
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || resetOtp.length !== 6}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Update Password & Sign In</span>
                </>
              )}
            </button>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-stone-500 hover:text-stone-800 font-medium"
              >
                ← Back to Sign In
              </button>

              <button
                type="button"
                onClick={handleForgotSubmit}
                disabled={cooldown > 0 || loading}
                className={`font-bold flex items-center gap-1 ${
                  cooldown > 0
                    ? 'text-stone-400 cursor-not-allowed'
                    : 'text-amber-800 hover:underline hover:text-amber-900'
                }`}
              >
                {cooldown > 0 ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend in {cooldown}s</span>
                  </>
                ) : (
                  <span>Resend Code</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Simple Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col gap-3 text-xs text-stone-500">
          <button
            type="button"
            onClick={() => navigateTo('admin')}
            className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-stone-800 shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Owner / Staff PIN Portal</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-stone-900 font-medium"
            >
              ← Return to Home
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="hover:text-stone-900 font-medium"
            >
              Browse Shop as Guest →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

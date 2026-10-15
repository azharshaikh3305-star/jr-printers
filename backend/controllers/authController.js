
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  sendVerificationOTP,
  sendPasswordResetOTP,
} from "../services/emailService.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const generateSecureOTP = () =>
  crypto.randomInt(100000, 1000000).toString();

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const databaseAvailable = () => mongoose.connection.readyState === 1;

const requireDatabase = (res) => {
  if (databaseAvailable()) return true;

  errorResponse(res, 503, "Database is unavailable. Please try again later.");
  return false;
};

const otpExpiry = () => new Date(Date.now() + OTP_TTL_MS);

const cooldownRemaining = (lastSent) => {
  if (!lastSent) return 0;

  const elapsed = Date.now() - new Date(lastSent).getTime();
  return Math.max(0, OTP_COOLDOWN_MS - elapsed);
};

const clearEmailOtp = () => ({
  code: null,
  expiresAt: null,
  attempts: 0,
  lastResentAt: null,
});

const clearResetOtp = () => ({
  code: null,
  expiresAt: null,
  attempts: 0,
  lastResentAt: null,
  isVerified: false,
});

const otpIsExpired = (expiresAt) =>
  !expiresAt || Date.now() > new Date(expiresAt).getTime();

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  avatar: user.avatar,
});

const sendMailOrThrow = async (sendFunction, email, otp, name) => {
  // The email service must throw when SMTP delivery fails.
  // Never return the OTP to the client as a fallback.
  return sendFunction(email, otp, name);
};

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  let savedUser = null;
  let isNewUser = false;

  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !phone || !password) {
      return errorResponse(
        res,
        400,
        "Please provide name, email, phone number, and password."
      );
    }

    if (String(password).length < 6) {
      return errorResponse(
        res,
        400,
        "Password must be at least 6 characters long."
      );
    }

    if (!requireDatabase(res)) return;

    const normalizedEmail = normalizeEmail(email);
    const cleanName = String(name).trim();
    const cleanPhone = String(phone).trim();

    let user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationOtp.lastResentAt"
    );

    if (user?.isEmailVerified) {
      return errorResponse(
        res,
        409,
        "An account with this email already exists. Please sign in."
      );
    }

    if (user) {
      const remaining = cooldownRemaining(
        user.emailVerificationOtp?.lastResentAt
      );

      if (remaining > 0) {
        return errorResponse(
          res,
          429,
          `Please wait ${Math.ceil(remaining / 1000)} seconds before requesting another OTP.`
        );
      }
    } else {
      user = new User({
        name: cleanName,
        email: normalizedEmail,
        phone: cleanPhone,
        password: String(password),
        role: "user",
        isEmailVerified: false,
      });

      isNewUser = true;
    }

    const otp = generateSecureOTP();

    user.name = cleanName;
    user.phone = cleanPhone;

    if (!isNewUser) {
      user.password = String(password);
    }

    user.isEmailVerified = false;
    user.emailVerificationOtp = {
      code: otp,
      expiresAt: otpExpiry(),
      attempts: 0,
      lastResentAt: new Date(),
    };

    await user.save();
    savedUser = user;

    try {
      await sendMailOrThrow(
        sendVerificationOTP,
        normalizedEmail,
        otp,
        cleanName
      );
    } catch (mailError) {
      console.error("Registration email delivery failed:", mailError.message);

      if (isNewUser) {
        await User.deleteOne({ _id: user._id });
      } else {
        user.emailVerificationOtp = clearEmailOtp();
        await user.save();
      }

      return errorResponse(
        res,
        503,
        "Verification email could not be sent. Check your email configuration and try again."
      );
    }

    return successResponse(
      res,
      isNewUser ? 201 : 200,
      "Verification email sent. Please check your inbox.",
      {
        email: normalizedEmail,
        requiresOtp: true,
        expiresInMinutes: 10,
      }
    );
  } catch (error) {
    // Do not expose internal errors or OTPs to the client.
    if (savedUser && isNewUser) {
      try {
        await User.deleteOne({ _id: savedUser._id });
      } catch {
        // Preserve the original error.
      }
    }

    next(error);
  }
};

/**
 * POST /api/auth/verify-email-otp
 */
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return errorResponse(res, 400, "Please provide email and OTP.");
    }

    if (!requireDatabase(res)) return;

    const normalizedEmail = normalizeEmail(email);
    const submittedOtp = String(otp).trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationOtp.code +emailVerificationOtp.expiresAt +emailVerificationOtp.attempts"
    );

    if (!user) {
      return errorResponse(res, 404, "No account found with this email.");
    }

    if (user.isEmailVerified) {
      const token = generateToken(user._id, user.role);

      return successResponse(res, 200, "Account is already verified.", {
        token,
        user: safeUser(user),
      });
    }

    const data = user.emailVerificationOtp;

    if (!data?.code || !data.expiresAt) {
      return errorResponse(
        res,
        400,
        "No active verification code. Please request a new OTP."
      );
    }

    if ((data.attempts || 0) >= MAX_OTP_ATTEMPTS) {
      user.emailVerificationOtp = clearEmailOtp();
      await user.save();

      return errorResponse(
        res,
        429,
        "Too many incorrect attempts. Please request a new OTP."
      );
    }

    if (otpIsExpired(data.expiresAt)) {
      user.emailVerificationOtp = clearEmailOtp();
      await user.save();

      return errorResponse(
        res,
        400,
        "Verification code expired. Please request a new OTP."
      );
    }

    if (String(data.code) !== submittedOtp) {
      user.emailVerificationOtp.attempts = (data.attempts || 0) + 1;
      await user.save();

      const remaining = MAX_OTP_ATTEMPTS - user.emailVerificationOtp.attempts;

      return errorResponse(
        res,
        400,
        `Invalid verification code. ${remaining} attempts remaining.`
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = clearEmailOtp();

    await user.save();

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, "Email verified successfully.", {
      token,
      user: safeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-email-otp
 */
export const resendEmailOtp = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return errorResponse(res, 400, "Please provide an email address.");
    }

    if (!requireDatabase(res)) return;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationOtp.lastResentAt"
    );

    if (!user) {
      return errorResponse(res, 404, "No account found with this email.");
    }

    if (user.isEmailVerified) {
      return errorResponse(
        res,
        400,
        "This account is already verified. Please sign in."
      );
    }

    const remaining = cooldownRemaining(
      user.emailVerificationOtp?.lastResentAt
    );

    if (remaining > 0) {
      return errorResponse(
        res,
        429,
        `Please wait ${Math.ceil(remaining / 1000)} seconds before requesting another OTP.`
      );
    }

    const otp = generateSecureOTP();

    user.emailVerificationOtp = {
      code: otp,
      expiresAt: otpExpiry(),
      attempts: 0,
      lastResentAt: new Date(),
    };

    await user.save();

    try {
      await sendVerificationOTP(user.email, otp, user.name);
    } catch (mailError) {
      console.error("Resend email failed:", mailError.message);

      user.emailVerificationOtp = clearEmailOtp();
      await user.save();

      return errorResponse(
        res,
        503,
        "Could not send the verification email. Please try again later."
      );
    }

    return successResponse(res, 200, "Verification email sent.", {
      email: normalizedEmail,
      expiresInMinutes: 10,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return errorResponse(res, 400, "Please provide your email address.");
    }

    if (!requireDatabase(res)) return;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+resetPasswordOtp.lastResentAt"
    );

    // Generic response avoids revealing whether an account exists.
    if (!user) {
      return successResponse(
        res,
        200,
        "If an account exists with this email, a reset code will be sent."
      );
    }

    const remaining = cooldownRemaining(user.resetPasswordOtp?.lastResentAt);

    if (remaining > 0) {
      return errorResponse(
        res,
        429,
        `Please wait ${Math.ceil(remaining / 1000)} seconds before requesting another code.`
      );
    }

    const otp = generateSecureOTP();

    user.resetPasswordOtp = {
      code: otp,
      expiresAt: otpExpiry(),
      attempts: 0,
      lastResentAt: new Date(),
      isVerified: false,
    };

    await user.save();

    try {
      await sendPasswordResetOTP(user.email, otp, user.name);
    } catch (mailError) {
      console.error("Password reset email failed:", mailError.message);

      user.resetPasswordOtp = clearResetOtp();
      await user.save();

      return errorResponse(
        res,
        503,
        "Password reset email could not be sent. Please try again later."
      );
    }

    return successResponse(
      res,
      200,
      "If an account exists with this email, a reset code will be sent.",
      { expiresInMinutes: 10 }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-reset-otp
 */
export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return errorResponse(res, 400, "Please provide email and OTP.");
    }

    if (!requireDatabase(res)) return;

    const normalizedEmail = normalizeEmail(email);
    const submittedOtp = String(otp).trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+resetPasswordOtp.code +resetPasswordOtp.expiresAt +resetPasswordOtp.attempts +resetPasswordOtp.isVerified"
    );

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired reset code.");
    }

    const data = user.resetPasswordOtp;

    if (!data?.code || !data.expiresAt) {
      return errorResponse(
        res,
        400,
        "No active reset code. Please request a new one."
      );
    }

    if ((data.attempts || 0) >= MAX_OTP_ATTEMPTS) {
      user.resetPasswordOtp = clearResetOtp();
      await user.save();

      return errorResponse(
        res,
        429,
        "Too many incorrect attempts. Request a new reset code."
      );
    }

    if (otpIsExpired(data.expiresAt)) {
      user.resetPasswordOtp = clearResetOtp();
      await user.save();

      return errorResponse(
        res,
        400,
        "Reset code expired. Please request a new one."
      );
    }

    if (String(data.code) !== submittedOtp) {
      user.resetPasswordOtp.attempts = (data.attempts || 0) + 1;
      await user.save();

      const remaining = MAX_OTP_ATTEMPTS - user.resetPasswordOtp.attempts;

      return errorResponse(
        res,
        400,
        `Invalid reset code. ${remaining} attempts remaining.`
      );
    }

    user.resetPasswordOtp.isVerified = true;
    await user.save();

    return successResponse(res, 200, "Reset code verified.", {
      verified: true,
      email: normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return errorResponse(
        res,
        400,
        "Please provide email, OTP, and new password."
      );
    }

    if (String(newPassword).length < 6) {
      return errorResponse(
        res,
        400,
        "New password must be at least 6 characters long."
      );
    }

    if (!requireDatabase(res)) return;

    const normalizedEmail = normalizeEmail(email);
    const submittedOtp = String(otp).trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+resetPasswordOtp.code +resetPasswordOtp.expiresAt +resetPasswordOtp.isVerified +password"
    );

    if (!user) {
      return errorResponse(res, 400, "Invalid reset request.");
    }

    const data = user.resetPasswordOtp;

    if (
      !data?.code ||
      !data.isVerified ||
      String(data.code) !== submittedOtp
    ) {
      return errorResponse(
        res,
        400,
        "Verify your reset code before changing your password."
      );
    }

    if (otpIsExpired(data.expiresAt)) {
      user.resetPasswordOtp = clearResetOtp();
      await user.save();

      return errorResponse(
        res,
        400,
        "Reset code expired. Please request a new one."
      );
    }

    user.password = String(newPassword);
    user.resetPasswordOtp = clearResetOtp();

    await user.save();

    return successResponse(
      res,
      200,
      "Password updated successfully. You can now sign in."
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body || {};

    if (!emailOrPhone || !password) {
      return errorResponse(
        res,
        400,
        "Please provide your email or phone number and password."
      );
    }

    if (!requireDatabase(res)) return;

    const input = String(emailOrPhone).trim();
    const normalizedInput = input.toLowerCase();
    const digits = input.replace(/\D/g, "");

    const user = await User.findOne({
      $or: [
        { email: normalizedInput },
        { phone: input },
        { phone: digits },
        { phone: `+91 ${digits}` },
        { phone: `+91${digits}` },
      ],
    }).select("+password +emailVerificationOtp.code");

    if (!user) {
      return errorResponse(res, 401, "Invalid credentials.");
    }

    const passwordMatches = await user.matchPassword(String(password));

    if (!passwordMatches) {
      return errorResponse(res, 401, "Invalid credentials.");
    }

    if (!user.isEmailVerified && user.role !== "admin") {
      const otp = generateSecureOTP();

      user.emailVerificationOtp = {
        code: otp,
        expiresAt: otpExpiry(),
        attempts: 0,
        lastResentAt: new Date(),
      };

      await user.save();

      try {
        await sendVerificationOTP(user.email, otp, user.name);
      } catch (mailError) {
        console.error("Login verification email failed:", mailError.message);

        user.emailVerificationOtp = clearEmailOtp();
        await user.save();

        return errorResponse(
          res,
          503,
          "Verification email could not be sent. Please try again later."
        );
      }

      return successResponse(
        res,
        200,
        "Your email is not verified. A verification code has been sent.",
        {
          requiresOtp: true,
          email: user.email,
        }
      );
    }

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, `Welcome back, ${user.name}!`, {
      token,
      user: safeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    if (!requireDatabase(res)) return;

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User account not found.");
    }

    return successResponse(res, 200, "User profile retrieved.", {
      user: safeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    if (!requireDatabase(res)) return;

    const { name, phone, avatar } = req.body || {};
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    if (name) user.name = String(name).trim();
    if (phone) user.phone = String(phone).trim();
    if (avatar !== undefined) user.avatar = avatar;

    // Email changes must use a separate email-verification flow.
    if (req.body?.email && normalizeEmail(req.body.email) !== user.email) {
      return errorResponse(
        res,
        400,
        "Email changes require a separate verification process."
      );
    }

    await user.save();

    return successResponse(res, 200, "Profile updated successfully.", {
      user: safeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/admin-login
 *
 * Configure ADMIN_SECURITY_PIN and ADMIN_INITIAL_PASSWORD in .env.
 * Remove any old hardcoded admin PINs from the application.
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { pin } = req.body || {};
    const configuredPin = process.env.ADMIN_SECURITY_PIN;

    if (!configuredPin) {
      return errorResponse(
        res,
        503,
        "Admin login is not configured on the server."
      );
    }

    if (
      !pin ||
      String(pin).trim().length !== configuredPin.length ||
      !crypto.timingSafeEqual(
        Buffer.from(String(pin).trim()),
        Buffer.from(configuredPin)
      )
    ) {
      return errorResponse(res, 401, "Invalid admin security PIN.");
    }

    if (!requireDatabase(res)) return;

    let adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

      if (!initialPassword || initialPassword.length < 12) {
        return errorResponse(
          res,
          503,
          "Configure ADMIN_INITIAL_PASSWORD with at least 12 characters before creating the admin account."
        );
      }

      adminUser = await User.create({
        name: "JR PRINTING WORKS Admin",
        email: "admin@jrprinting.in",
        phone: "",
        password: initialPassword,
        role: "admin",
        isEmailVerified: true,
      });
    }

    const token = generateToken(adminUser._id, "admin");

    return successResponse(res, 200, "Admin login successful.", {
      token,
      user: safeUser(adminUser),
    });
  } catch (error) {
    next(error);
  }
};

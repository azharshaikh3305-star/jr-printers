
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide full name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Please provide a contact phone number"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerificationOtp: {
      code: {
        type: String,
        default: null,
        select: false,
      },
      expiresAt: {
        type: Date,
        default: null,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
      lastResentAt: {
        type: Date,
        default: null,
        select: false,
      },
    },

    resetPasswordOtp: {
      code: {
        type: String,
        default: null,
        select: false,
      },
      expiresAt: {
        type: Date,
        default: null,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
      lastResentAt: {
        type: Date,
        default: null,
        select: false,
      },
      isVerified: {
        type: Boolean,
        default: false,
        select: false,
      },
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password only when it changes.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare a plain-text password with its stored hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;

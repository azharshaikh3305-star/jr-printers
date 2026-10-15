import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'JR PRINTING WORKS',
    },
    proprietor: {
      type: String,
      default: 'Pro. Shaikh Sameer',
    },
    phone1: {
      type: String,
      default: '+91 7888162822',
    },
    phone2: {
      type: String,
      default: '+91 7888162824',
    },
    upiId: {
      type: String,
      default: '7888162822@upi',
    },
    freeShippingThreshold: {
      type: Number,
      default: 999,
    },
    announcementText: {
      type: String,
      default:
        '✨ All India Safe Dispatch | 100% Sublimation & DTG Precision | WhatsApp Support +91 7888162822',
    },
    isStoreLive: {
      type: Boolean,
      default: true,
    },
    gstRate: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;

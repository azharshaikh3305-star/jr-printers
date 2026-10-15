import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import { initialProducts, initialOrders, initialInquiries, initialSettings } from '../data/seedData.js';

let isConnected = false;

/**
 * Automatically seeds the database if empty
 */
const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log(`📦 Auto-seeded ${initialProducts.length} initial products into database`);
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create(initialSettings);
      console.log('⚙️  Auto-seeded store payment & helpline settings');
    }

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      await User.create({
        name: 'Pro. Shaikh Sameer',
        email: 'admin@jrprinting.in',
        phone: '+91 7888162822',
        password: 'AdminSuperPassword7888',
        role: 'admin',
        isEmailVerified: true,
      });
      console.log('👤 Auto-seeded default admin account (Shaikh Sameer: admin@jrprinting.in / PIN: 7888)');
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(initialOrders);
    }

    const inqCount = await Inquiry.countDocuments();
    if (inqCount === 0) {
      await Inquiry.insertMany(initialInquiries);
    }
  } catch (seedErr) {
    console.warn('Notice during auto-seeding:', seedErr.message);
  }
};

/**
 * Connect to MongoDB using Mongoose
 * Uses external MONGO_URI if reachable, otherwise logs notice without crashing dev server
 */
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jr_printing_db';
  const isCustomUri = mongoUri && !mongoUri.includes('127.0.0.1:27017') && !mongoUri.includes('localhost:27017');

  try {
    // If a custom external URI (like MongoDB Atlas) is configured
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: isCustomUri ? 5000 : 1500,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    await autoSeedIfEmpty();
    return conn;
  } catch (err) {
    isConnected = false;
    console.warn(`ℹ️ Database Notice: MongoDB connection not active (${err.message}).`);
    console.warn(`   Configure MONGO_URI in .env with a live MongoDB Atlas connection string when ready.`);
    return null;
  }
};

export default connectDB;

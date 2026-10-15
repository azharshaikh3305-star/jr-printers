import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Inquiry from './models/Inquiry.js';
import Settings from './models/Settings.js';
import User from './models/User.js';
import { initialProducts, initialOrders, initialInquiries, initialSettings } from './data/seedData.js';

const seedDatabase = async () => {
  console.log('🌱 Starting JR PRINTING WORKS MongoDB Database Seed...');

  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Cannot seed database: MongoDB connection unavailable.');
    process.exit(1);
  }

  try {
    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log(`✅ Seeded ${initialProducts.length} initial products into MongoDB.`);
    } else {
      console.log(`ℹ️ Products collection already has ${productCount} records. Keeping existing.`);
    }

    // 2. Seed Store Settings if empty
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create(initialSettings);
      console.log('✅ Seeded store payment & helpline settings into MongoDB.');
    } else {
      console.log('ℹ️ Store settings already exist. Keeping existing.');
    }

    // 3. Seed Admin User
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
      console.log('✅ Seeded default Admin user (Shaikh Sameer: admin@jrprinting.in / AdminSuperPassword7888).');
    }

    // 4. Seed Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(initialOrders);
      console.log(`✅ Seeded ${initialOrders.length} sample orders.`);
    }

    // 5. Seed Inquiries if empty
    const inqCount = await Inquiry.countDocuments();
    if (inqCount === 0) {
      await Inquiry.insertMany(initialInquiries);
      console.log(`✅ Seeded ${initialInquiries.length} sample inquiries.`);
    }

    console.log('🎉 Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
};

seedDatabase();

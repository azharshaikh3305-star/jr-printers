import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Database & Backend modules from backend/
import connectDB from './backend/config/db.js';
import authRoutes from './backend/routes/authRoutes.js';
import productRoutes from './backend/routes/productRoutes.js';
import orderRoutes from './backend/routes/orderRoutes.js';
import inquiryRoutes from './backend/routes/inquiryRoutes.js';
import designRoutes from './backend/routes/designRoutes.js';
import settingsRoutes from './backend/routes/settingsRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';
import paymentRoutes from './backend/routes/paymentRoutes.js';
import cartRoutes from './backend/routes/cartRoutes.js';
import { errorHandler } from './backend/middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Connect to MongoDB
connectDB().catch((err) => {
  console.warn('MongoDB connection notice:', err?.message || err);
});

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check API Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JR PRINTING WORKS Full-Stack Server & Backend API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Ready for MongoDB URI',
      host: mongoose.connection.host || 'none',
      name: mongoose.connection.name || 'none',
    },
  });
});

// Mount Backend REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);

// Centralized API Error Handling (Returns consistent JSON errors for all /api routes)
app.use('/api', errorHandler);

// Frontend Vite Dev Server Middleware or Production Static Serve
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  // Mount Vite dev server in middleware mode
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

// Start Server on Port 3000 for AI Studio environment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 JR PRINTING WORKS Full-Stack Server running at http://0.0.0.0:${PORT}`);
  console.log(`📡 Backend REST APIs available at http://0.0.0.0:${PORT}/api/`);
});

export default app;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { DesignerPage } from './components/designer/DesignerPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/order/OrderSuccessPage';
import { AccountPage } from './components/account/AccountPage';
import { AboutPage } from './components/about/AboutPage';
import { ContactPage } from './components/contact/ContactPage';
import { LoginPage } from './components/auth/LoginPage';
import { FloatingContactWidget } from './components/common/FloatingContactWidget';
import { AdminPanel } from './components/admin/AdminPanel';
import { SEOManager } from './components/common/SEOManager';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // If on Admin page, render dedicated Admin Dashboard layout
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F5F0] text-stone-900 overflow-x-hidden w-full max-w-full">
        <SEOManager />
        <AdminPanel />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-stone-900 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Dynamic SEO, Open Graph & Twitter Social Tags */}
      <SEOManager />

      {/* Top Header compliant with 3-Zone Contract */}
      <Header />

      {/* Main Page Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'product-detail' && <ProductDetailPage />}
        {currentPage === 'designer' && <DesignerPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-success' && <OrderSuccessPage />}
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'login' && <LoginPage />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Floating Quick Support Widget */}
      <FloatingContactWidget />

      {/* Footer (Hidden only when in custom designer studio to give full height to canvas) */}
      {currentPage !== 'designer' && <Footer />}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from '../../types';
import { AdminAuthModal } from './AdminAuthModal';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminCustomJobsTab } from './tabs/AdminCustomJobsTab';
import { AdminInquiriesTab } from './tabs/AdminInquiriesTab';
import { AdminDatabaseSettingsTab } from './tabs/AdminDatabaseSettingsTab';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Palette,
  MessageSquare,
  Database,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  Store,
  CheckCircle,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    isAdminAuthenticated,
    logoutAdmin,
    navigateTo,
    orders,
    products,
    inquiries,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not authenticated, show secure Admin PIN entry screen
  if (!isAdminAuthenticated) {
    return <AdminAuthModal />;
  }

  const activePrintingCount = orders.filter(
    (o) => o.orderStatus === 'Printing' || o.orderStatus === 'Processing'
  ).length;
  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'New').length;

  const tabs = [
    {
      id: 'overview' as AdminTab,
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders & Queue',
      icon: <Package className="w-4 h-4" />,
      badge: activePrintingCount > 0 ? activePrintingCount : undefined,
    },
    {
      id: 'products' as AdminTab,
      label: 'Products Catalog',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: products.length,
    },
    {
      id: 'custom-jobs' as AdminTab,
      label: 'Studio Jobs',
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: 'inquiries' as AdminTab,
      label: 'Leads & Quotes',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'database' as AdminTab,
      label: 'Database & Settings',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-stone-900 pb-16">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-[#25030E] text-white border-b border-rose-950 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-black text-base sm:text-lg flex items-center justify-center font-display border border-amber-300 shrink-0">
                JR
              </div>
              <div>
                <div className="font-display font-black text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5 uppercase leading-none">
                  <span>PRINTING WORKS</span>
                  <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest font-mono">
                    ADMIN
                  </span>
                </div>
                <div className="text-[10px] text-amber-300 font-semibold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Pro. Shaikh Sameer Hub</span>
                </div>
              </div>
            </button>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="px-2.5 sm:px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700/80"
              title="Switch to customer storefront"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-2.5 sm:px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-800/80"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            {/* Mobile Tab Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-stone-300 hover:text-white rounded-xl bg-stone-900"
              aria-label="Toggle admin tabs"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Fast-Pill Navigation Bar (Always 1-tap accessible on phones) */}
        <div className="md:hidden border-t border-rose-950/80 bg-[#1D020B] px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-300 bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label.split(' ')[0]}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[9px] px-1 py-0.1 rounded-full font-mono font-black ${
                      isActive ? 'bg-stone-950 text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Tab Navigation Bar */}
        <div className="hidden md:block border-t border-rose-950/80 bg-[#1D020B]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                        tab.badgeColor
                          ? tab.badgeColor
                          : isActive
                          ? 'bg-stone-950 text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (Extended Menu for Mobile Devices) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1D020B] text-white p-4 border-b border-rose-950 space-y-1.5 animate-in slide-in-from-top-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1 mb-1">
            Admin Sections
          </div>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-black'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-black ${
                      isActive ? 'bg-stone-950 text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-rose-950/80 flex items-center justify-between gap-2">
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Storefront</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="py-2 px-3 bg-rose-950 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            setActiveTab={setActiveTab}
            openAddProductModal={() => {
              setActiveTab('products');
              setIsAddProductModalOpen(true);
            }}
          />
        )}

        {activeTab === 'orders' && <AdminOrdersTab />}

        {activeTab === 'products' && (
          <AdminProductsTab
            isAddModalOpen={isAddProductModalOpen}
            setIsAddModalOpen={setIsAddProductModalOpen}
          />
        )}

        {activeTab === 'custom-jobs' && <AdminCustomJobsTab />}

        {activeTab === 'inquiries' && <AdminInquiriesTab />}

        {activeTab === 'database' && <AdminDatabaseSettingsTab />}
      </main>
    </div>
  );
};

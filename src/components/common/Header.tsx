import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Palette,
  ArrowRight,
  Phone,
  Headphones,
  MessageSquare,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JR_INFO } from '../../data/products';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    currentUser,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Notification / Trust Bar with Direct Contact Helpline */}
      <div className="bg-[#2B0612] text-stone-200 text-xs py-1 sm:py-1.5 px-2.5 sm:px-4 border-b border-rose-950 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-0.5 sm:gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
            <span className="text-amber-400 font-black tracking-wide">JR PRINTING WORKS</span>
            <span className="text-rose-400">·</span>
            <span className="text-amber-200 font-semibold truncate">Pro. Shaikh Sameer</span>
            <span className="hidden lg:inline text-rose-300/60">·</span>
            <span className="hidden lg:inline text-stone-300 text-[11px]">
              T-Shirt · Cup · Pillow · Bottle · Keychain · Photo Frame · Mobile Cover Printing
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
            <a
              href="https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works%2C%20I%20want%20to%20inquire%20about%20printing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-200 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
              <span>WhatsApp: <strong className="text-white font-mono font-bold">7888162822</strong></span>
            </a>
            <span className="text-rose-800">|</span>
            <a
              href="https://wa.me/917888162824?text=Hello%20Pro.%20Shaikh%20Sameer%2C%20I%20want%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>Sameer: <strong className="text-white font-mono font-bold">7888162824</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header (Top Bar Contract: 3 Zones) */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-1 sm:gap-4 lg:gap-6">
          {/* ZONE 1: Brand Wordmark (JR PRINTING WORKS) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              className="group text-left flex items-center gap-1.5 sm:gap-2.5 transition-transform active:scale-95 shrink-0"
            >
              {/* JR Logo Icon - Smaller on phone as requested */}
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xs border border-amber-300 shrink-0">
                <span className="text-stone-950 font-black text-xs sm:text-lg tracking-tighter font-display leading-none">
                  JR
                </span>
              </div>
              {/* Brand Text - Stacked and neatly adjusted on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1 text-left leading-none">
                <span className="font-display font-black text-xs sm:text-base tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors uppercase leading-none">
                  PRINTING
                </span>
                <span className="font-display font-black text-[9px] sm:text-base tracking-tight text-amber-700 sm:text-stone-900 group-hover:text-amber-800 transition-colors uppercase leading-none">
                  WORKS
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: Clean Text Navigation Links - Visible from md and up */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6 text-xs lg:text-sm font-medium text-stone-600">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                currentPage === 'home' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              Home
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                navigateTo('shop');
              }}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                currentPage === 'shop' && activeCategory === 'all'
                  ? 'text-stone-950 font-bold'
                  : 'text-stone-600'
              }`}
            >
              Shop All
              {currentPage === 'shop' && activeCategory === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('custom');
                navigateTo('shop');
              }}
              className={`hover:text-stone-900 transition-colors py-1 relative hidden lg:inline ${
                currentPage === 'shop' && activeCategory === 'custom'
                  ? 'text-amber-800 font-bold'
                  : 'text-stone-600'
              }`}
            >
              T-Shirts
              {currentPage === 'shop' && activeCategory === 'custom' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('cups');
                navigateTo('shop');
              }}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                currentPage === 'shop' && activeCategory === 'cups'
                  ? 'text-amber-800 font-bold'
                  : 'text-stone-600'
              }`}
            >
              Cups & Mugs
              {currentPage === 'shop' && activeCategory === 'cups' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('pillows');
                navigateTo('shop');
              }}
              className={`hover:text-stone-900 transition-colors py-1 relative hidden xl:inline ${
                currentPage === 'shop' && activeCategory === 'pillows'
                  ? 'text-amber-800 font-bold'
                  : 'text-stone-600'
              }`}
            >
              Pillows
              {currentPage === 'shop' && activeCategory === 'pillows' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('bottles');
                navigateTo('shop');
              }}
              className={`hover:text-stone-900 transition-colors py-1 relative hidden xl:inline ${
                currentPage === 'shop' && activeCategory === 'bottles'
                  ? 'text-amber-800 font-bold'
                  : 'text-stone-600'
              }`}
            >
              Bottles
              {currentPage === 'shop' && activeCategory === 'bottles' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('frames');
                navigateTo('shop');
              }}
              className={`hover:text-stone-900 transition-colors py-1 relative hidden xl:inline ${
                currentPage === 'shop' && activeCategory === 'frames'
                  ? 'text-amber-800 font-bold'
                  : 'text-stone-600'
              }`}
            >
              Frames
              {currentPage === 'shop' && activeCategory === 'frames' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => navigateTo('designer')}
              className={`hover:text-amber-800 transition-colors py-1 flex items-center gap-1.5 relative ${
                currentPage === 'designer' ? 'text-amber-800 font-semibold' : ''
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Custom Studio</span>
              {currentPage === 'designer' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            {/* Direct Contact Nav Tab */}
            <button
              onClick={() => navigateTo('contact')}
              className={`hover:text-stone-900 transition-colors py-1 relative ${
                currentPage === 'contact' ? 'text-amber-800 font-bold' : ''
              }`}
            >
              Contact Desk
              {currentPage === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>
          </nav>

          {/* ZONE 3: Primary Actions (Search, Wishlist, Account, Cart, Mobile Menu) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Toggle Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle Search"
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors shrink-0 ${
                searchOpen
                  ? 'bg-stone-200 text-stone-900'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Wishlist (Desktop & Tablet) */}
            <button
              onClick={() => navigateTo('account')}
              aria-label="Wishlist"
              className="hidden sm:flex p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors relative shrink-0"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full" />
              )}
            </button>

            {/* User Account / Orders or Login Button */}
            {currentUser ? (
              <button
                onClick={() => navigateTo('account')}
                aria-label="User Account"
                className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl transition-colors text-xs font-semibold shrink-0 ${
                  currentPage === 'account'
                    ? 'bg-amber-100/90 text-amber-950 ring-1 ring-amber-300'
                    : 'hover:bg-stone-200/60 text-stone-800'
                }`}
                title={`Logged in as ${currentUser.name}`}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-black text-[11px] sm:text-xs flex items-center justify-center font-display border border-amber-300 shrink-0 shadow-2xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-stone-900 font-bold max-w-[80px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                aria-label="Sign In"
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-colors shrink-0 shadow-2xs ${
                  currentPage === 'login'
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 ring-1 ring-amber-300'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200'
                }`}
                title="Sign In to JR PRINTING WORKS"
              >
                <User className="w-3.5 h-3.5 text-stone-700" />
                <span className="hidden xs:inline">Login</span>
              </button>
            )}

            {/* Support Desk (Large screens) */}
            <button
              onClick={() => navigateTo('contact')}
              aria-label="Contact Studio"
              title="Speak with a Print Specialist"
              className={`hidden lg:flex p-2 rounded-xl transition-colors items-center gap-1.5 text-xs font-semibold shrink-0 ${
                currentPage === 'contact'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Headphones className="w-4 h-4 text-amber-700" />
              <span className="hidden xl:inline text-stone-800">Support</span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-1 sm:gap-1.5 bg-stone-900 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl hover:bg-stone-800 transition-colors shadow-xs text-[11px] sm:text-xs font-semibold shrink-0 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-mono tabular-nums text-[11px] sm:text-xs">{cartCount}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle (Three Line Icon) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-stone-900 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border border-stone-300/90 rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center shadow-xs"
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4.5 h-4.5 text-stone-900" />
              ) : (
                <Menu className="w-4.5 h-4.5 text-stone-900 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Full-width Search Bar Dropdown (Mobile & Desktop) */}
        {searchOpen && (
          <div className="border-t border-stone-200/80 bg-white/95 backdrop-blur-md px-4 py-3 shadow-md animate-in slide-in-from-top-1">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search T-shirts, mugs, pillows, bottles, frames..."
                  className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-stone-900 transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-stone-800 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800 transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer with Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Sheet */}
            <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#FAF9F5] shadow-2xl flex flex-col justify-between overflow-y-auto p-5 animate-in slide-in-from-right duration-200 z-10">
              <div className="space-y-4">
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-black text-lg flex items-center justify-center font-display border border-amber-300 shadow-2xs">
                      JR
                    </div>
                    <div>
                      <div className="font-display font-black text-stone-900 text-sm leading-none">
                        JR PRINTING WORKS
                      </div>
                      <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                        Pro. Shaikh Sameer
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200/60"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Account / Profile Card */}
                {currentUser ? (
                  <div className="p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-black text-base flex items-center justify-center font-display border border-amber-300 shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-bold text-xs text-stone-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {currentUser.email || currentUser.phone}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        onClick={() => {
                          navigateTo('account');
                          setMobileMenuOpen(false);
                        }}
                        className="py-2 px-3 bg-stone-900 text-white rounded-xl text-center shadow-xs"
                      >
                        My Account
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="py-2 px-3 bg-stone-100 hover:bg-rose-50 text-rose-700 rounded-xl text-center transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigateTo('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-3.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl font-bold flex items-center justify-between text-xs shadow-md active:scale-98 transition-transform"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs">Sign In / Register</div>
                        <div className="text-[10px] text-stone-300">Track orders & save designs</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                )}

                {/* Quick Shortcuts: Wishlist & Cart */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => {
                      navigateTo('account');
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Wishlist ({wishlist.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-center gap-2 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-stone-900" />
                    <span>Cart ({cartCount})</span>
                  </button>
                </div>

                {/* Store Categories List */}
                <div className="space-y-1 text-xs font-semibold text-stone-700 pt-2 border-t border-stone-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 px-1">
                    Store Categories
                  </div>
                  {[
                    { label: 'Home', action: () => navigateTo('home') },
                    { label: 'All Catalog Products', action: () => { setSearchQuery(''); setActiveCategory('all'); navigateTo('shop'); } },
                    { label: '👕 T-Shirt Printing', action: () => { setSearchQuery(''); setActiveCategory('custom'); navigateTo('shop'); } },
                    { label: '☕ Cup & Magic Mugs', action: () => { setSearchQuery(''); setActiveCategory('cups'); navigateTo('shop'); } },
                    { label: '🛋️ Pillow Printing', action: () => { setSearchQuery(''); setActiveCategory('pillows'); navigateTo('shop'); } },
                    { label: '🍾 Bottle Printing', action: () => { setSearchQuery(''); setActiveCategory('bottles'); navigateTo('shop'); } },
                    { label: '🖼️ Photo Frames', action: () => { setSearchQuery(''); setActiveCategory('frames'); navigateTo('shop'); } },
                    { label: '🔑 Key Chain Printing', action: () => { setSearchQuery(''); setActiveCategory('keychains'); navigateTo('shop'); } },
                    { label: '📱 Mobile Back Covers', action: () => { setSearchQuery(''); setActiveCategory('mobile-covers'); navigateTo('shop'); } },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-stone-200/60 flex items-center justify-between transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      navigateTo('designer');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-between transition-colors mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-600" />
                      <span>Custom Studio Editor</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold flex items-center justify-between transition-colors mt-2 shadow-2xs border border-stone-800"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Owner / Admin Portal</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Bottom Support Helpline Card */}
              <div className="pt-4 border-t border-stone-200 mt-4 text-xs">
                <a
                  href={JR_INFO.whatsapp1Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-between shadow-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>WhatsApp: 7888162822</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PRODUCTS, JR_INFO } from '../../data/products';
import { TShirtBaseSvg } from '../common/TShirtBaseSvg';
import { ProductCard } from '../shop/ProductCard';
import {
  Package,
  Heart,
  Palette,
  MapPin,
  Settings,
  User,
  ArrowRight,
  ExternalLink,
  Trash2,
  Copy,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  MessageSquare,
  Phone,
  LogOut,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    orders,
    savedDesigns,
    deleteSavedDesign,
    loadDesignIntoStudio,
    saveDesign,
    wishlist,
    addToCart,
    navigateTo,
    addToast,
    currentUser,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'designs' | 'wishlist' | 'addresses' | 'settings'>('orders');

  const wishlistedProducts = SAMPLE_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B0411] text-amber-300 text-xs font-bold mb-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>JR PRINTING WORKS · Pro. Shaikh Sameer</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-stone-900 mt-1">
              Customer Portal & Order History
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage your past print orders, saved custom designs, and delivery addresses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={JR_INFO.whatsapp1Link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs font-mono"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Helpline: {JR_INFO.phone1}</span>
            </a>
          </div>
        </div>

        {/* User Authentication Status Banner */}
        <div className="mb-8 p-4 sm:p-5 bg-white rounded-3xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-black text-xl flex items-center justify-center font-display shadow-sm border border-amber-300 shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-stone-900">{currentUser.name}</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Logged In
                  </span>
                </div>
                <div className="text-xs text-stone-500 flex flex-wrap items-center gap-2 mt-0.5">
                  <span>{currentUser.email}</span>
                  <span>·</span>
                  <span className="font-mono">{currentUser.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center shrink-0 border border-stone-200">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-stone-900">Guest Visitor</h3>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Not Signed In
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sign in or create an account to sync your custom vector designs and track order progress.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end flex-wrap">
            <button
              onClick={() => navigateTo('admin')}
              className="px-3.5 py-2 bg-[#25030E] hover:bg-[#3E0619] text-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-rose-950 shadow-2xs"
              title="Access Store Management & Orders Queue"
            >
              <span>Owner & Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentUser ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-4 mb-8 text-xs font-semibold">
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'designs', label: `Saved Designs (${savedDesigns.length})`, icon: <Palette className="w-4 h-4" /> },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: <Heart className="w-4 h-4" /> },
            { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
            { id: 'settings', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 1. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
                <Package className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-bold text-base text-stone-900 font-display">No orders placed yet</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Once you order custom garments or blanks, track their real-time production here.
                </p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="mt-5 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  Shop Blank Catalog
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">
                          Order Number
                        </span>
                        <span className="font-mono font-bold text-stone-900">#{ord.orderId}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">
                          Date
                        </span>
                        <span className="font-semibold text-stone-700">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">
                          Total
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          ₹{ord.totalAmount.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {ord.orderStatus}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-600 font-mono text-[11px]">
                        Track: {ord.trackingNumber}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center justify-between">
                        <div className="flex gap-3.5 items-center">
                          <div className="w-16 h-20 bg-stone-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1.5 border border-stone-200/80">
                            <TShirtBaseSvg
                              color={item.colorHex}
                              view="front"
                              garmentType={item.garmentType}
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">
                              {item.productName}
                            </h4>
                            <p className="text-[11px] text-stone-500">
                              Size: {item.size} · Color: {item.colorName} · Qty: {item.quantity}
                            </p>
                            <span className="text-[10px] text-amber-800 font-semibold">
                              {item.printLocations.join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-xs text-stone-900">
                            ₹{item.totalPrice.toFixed(0)}
                          </span>

                          {item.customDesign && (
                            <button
                              onClick={() => loadDesignIntoStudio(item.customDesign!)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <Palette className="w-3.5 h-3.5" />
                              Re-Edit
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. SAVED DESIGNS TAB */}
        {activeTab === 'designs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-600">
                Your editable vector designs. Click <strong>Edit in Studio</strong> to reopen the complete multi-layer canvas with every element independently editable.
              </p>
              <button
                onClick={() => navigateTo('designer')}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-stone-800"
              >
                <Palette className="w-3.5 h-3.5" />
                New Design
              </button>
            </div>

            {savedDesigns.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
                <Palette className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-bold text-base text-stone-900 font-display">No saved designs yet</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Create your custom graphics in the studio and click "Save" to build your personal archive.
                </p>
                <button
                  onClick={() => navigateTo('designer')}
                  className="mt-5 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  Open Custom Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDesigns.map((ds) => (
                  <div
                    key={ds.id}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    {/* Mockup Canvas Preview */}
                    <div className="p-6 bg-stone-100 flex items-center justify-center relative aspect-4/3">
                      <div className="w-48 h-56 relative flex items-center justify-center">
                        <TShirtBaseSvg
                          color={ds.shirtColor}
                          view="front"
                          garmentType={ds.garmentId}
                        />
                        {/* Overlay Front Objects */}
                        <div className="absolute inset-0 pointer-events-none">
                          {(ds.views.front?.objects || []).map((o) => (
                            <div
                              key={o.id}
                              style={{
                                position: 'absolute',
                                left: `${(o.x / 500) * 100}%`,
                                top: `${(o.y / 600) * 100}%`,
                                width: `${(o.width / 500) * 100}%`,
                                height: `${(o.height / 600) * 100}%`,
                                transform: `translate(-50%, -50%) rotate(${o.rotation}deg)`,
                              }}
                              className="flex items-center justify-center"
                            >
                              {o.type === 'text' ? (
                                <span
                                  style={{
                                    fontFamily: o.fontFamily,
                                    fontSize: `${(o.fontSize || 16) * 0.3}px`,
                                    color: o.textColor,
                                  }}
                                  className="font-bold select-none text-center"
                                >
                                  {o.text}
                                </span>
                              ) : (
                                <img
                                  src={o.imageUrl}
                                  alt="graphic"
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-stone-800">
                        {ds.shirtColorName}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-stone-900">{ds.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                          <span>Updated {new Date(ds.updatedAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span className="font-mono">₹{ds.calculatedPrice || 1199}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => loadDesignIntoStudio(ds)}
                          className="flex-1 bg-stone-900 text-white hover:bg-stone-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Palette className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit in Studio</span>
                        </button>

                        <button
                          onClick={() => {
                            const duplicate = {
                              ...JSON.parse(JSON.stringify(ds)),
                              id: `design-${Date.now()}`,
                              title: `${ds.title} (Copy)`,
                              createdAt: Date.now(),
                              updatedAt: Date.now(),
                            };
                            saveDesign(duplicate);
                            addToast('Design duplicated', 'success');
                          }}
                          className="p-2 border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                          title="Duplicate Design"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteSavedDesign(ds.id)}
                          className="p-2 border border-stone-200 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
                <Heart className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-bold text-base text-stone-900 font-display">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Save your favorite apparel blanks while browsing to review or customize them later.
                </p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="mt-5 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {wishlistedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-stone-900 pb-2 border-b border-stone-100">
              Primary Delivery Address
            </h3>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
              <p className="font-bold text-stone-900">Alexander Wright</p>
              <p>742 Evergreen Terrace, Suite 4B</p>
              <p>Portland, OR 97201, United States</p>
              <p className="text-stone-500 mt-2">+1 (555) 234-8900</p>
            </div>
          </div>
        )}

        {/* 5. PREFERENCES / SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-stone-900 pb-2 border-b border-stone-100">
              Customer Account Preferences
            </h3>
            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-2.5 text-stone-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-stone-900 rounded" />
                <span>Receive DTG pre-flight proofs and digital swatches via email</span>
              </label>
              <label className="flex items-center gap-2.5 text-stone-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-stone-900 rounded" />
                <span>Notify me when new streetwear limited blank silhouettes drop</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

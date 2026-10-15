import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TShirtBaseSvg } from '../common/TShirtBaseSvg';
import { JR_INFO } from '../../data/products';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Palette,
  Tag,
  Check,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    navigateTo,
    loadDesignIntoStudio,
    addToast,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ATELIER10') {
      setDiscountPercent(10);
      addToast('Promo code applied: 10% discount!', 'success');
    } else {
      addToast('Invalid promo code. Try ATELIER10', 'error');
    }
  };

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const shippingCost = cartSubtotal >= 1499 || cartSubtotal === 0 ? 0 : 99;
  const taxAmount = (cartSubtotal - discountAmount) * 0.05;
  const finalTotal = cartSubtotal - discountAmount + shippingCost + taxAmount;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-stone-50 px-5 py-2.5 border-b border-stone-200/80 text-xs">
          {cartSubtotal >= 1499 ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              You qualify for complimentary express courier delivery!
            </span>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-stone-600">
                <span>Add ₹{(1499 - cartSubtotal).toFixed(0)} for free express delivery</span>
                <span className="font-mono">{Math.round((cartSubtotal / 1499) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / 1499) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-display font-bold text-stone-800 text-sm">Your bag is empty</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Browse our curated heavyweight blanks or personalize a custom T-shirt in our studio.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('shop');
                }}
                className="mt-4 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-stone-200/80 bg-white flex gap-3.5 shadow-2xs relative"
              >
                {/* Visual Thumbnail: Mini Vector T-shirt with accurate color */}
                <div className="w-20 h-24 bg-stone-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 relative">
                  <TShirtBaseSvg
                    color={item.colorHex}
                    view="front"
                    garmentType={item.garmentType}
                    showPrintAreaGuide={false}
                  />
                  {item.customDesign && (
                    <span className="absolute bottom-1 right-1 bg-amber-600 text-white text-[9px] font-bold px-1 rounded-sm">
                      DTG
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <span>Size: <strong className="text-stone-800">{item.size}</strong></span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span>{item.colorName}</span>
                      </div>
                    </div>

                    {/* Print Locations Tag */}
                    <div className="mt-1 text-[10px] text-stone-500 flex flex-wrap gap-1">
                      {item.printLocations.map((loc, i) => (
                        <span key={i} className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price & Edit Design Link */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Re-edit saved design button */}
                    {item.customDesign && (
                      <button
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          loadDesignIntoStudio(item.customDesign!);
                        }}
                        className="text-[11px] font-semibold text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <Palette className="w-3 h-3" />
                        <span>Edit Design</span>
                      </button>
                    )}

                    {/* Price */}
                    <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                      ₹{item.totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout & Summary Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (ATELIER10)"
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs outline-none uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Apply
              </button>
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{cartSubtotal.toFixed(0)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(0)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-mono tabular-nums">₹{taxAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* JR Banner Proofing Note */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#2B0411] to-[#3B0718] text-white flex items-center justify-between text-[11px] border border-rose-900/60">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-amber-400 text-stone-950 font-black text-[9px] flex items-center justify-center font-display">
                  JR
                </span>
                <span className="font-semibold text-amber-200">Pro. Shaikh Sameer</span>
              </div>
              <a
                href={JR_INFO.whatsapp1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
              >
                <MessageSquare className="w-3 h-3 fill-emerald-400" />
                <span>7888162822</span>
              </a>
            </div>

            {/* Checkout Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('shop');
                }}
                className="w-full text-center text-xs font-semibold text-stone-600 hover:text-stone-900 py-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

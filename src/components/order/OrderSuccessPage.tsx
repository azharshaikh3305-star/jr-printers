import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { TShirtBaseSvg } from '../common/TShirtBaseSvg';
import { JR_INFO } from '../../data/products';
import {
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  Printer,
  Calendar,
  MapPin,
  CreditCard,
  MessageSquare,
  Phone,
  ExternalLink,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastCompletedOrder, orders, navigateTo } = useApp();
  const order = lastCompletedOrder || orders[0];

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#18181b'],
      });
    } catch {}
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] py-20 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-bold text-stone-900">No active order found</h3>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { label: 'Order Received', desc: 'Payment verified', done: true },
    { label: 'Studio Pre-Flight', desc: 'Vector artwork proofing', done: true },
    { label: 'DTG Print Engine', desc: 'Direct-to-garment & curing', done: true, current: true },
    { label: 'Inspected & Dispatched', desc: 'Hand packaging & dispatch', done: false },
    { label: 'Delivered', desc: 'Signed on delivery', done: false },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Payment Confirmed · Receipt #{order.orderId}
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 mt-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mt-2 leading-relaxed">
            Your customized garments are entering our technical pre-flight pipeline. We will proof your vector elements and notify you via email as soon as printing begins.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-stone-600">
            <span>Tracking ID: <strong className="text-stone-900">{order.trackingNumber}</strong></span>
            <span>·</span>
            <span>Estimated Arrival: <strong className="text-stone-900">{order.estimatedDeliveryDate}</strong></span>
          </div>

          {/* JR PRINTING WORKS WhatsApp Order Proofing Callout */}
          <div className="mt-8 p-5 bg-gradient-to-r from-[#2B0411] to-[#3B0718] rounded-2xl border border-rose-900/60 text-white text-left max-w-xl mx-auto shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center font-display shadow-xs">
                  JR
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-amber-300">
                    JR PRINTING WORKS · Pro. Shaikh Sameer
                  </h4>
                  <span className="text-[10px] text-stone-300">Order ID: {order.orderId}</span>
                </div>
              </div>
              <span className="text-[10px] bg-rose-900/80 text-amber-300 px-2 py-0.5 rounded-full border border-rose-700/80 font-semibold">
                Photo Proofing
              </span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              If your order includes custom photos or text (Mugs, Pillows, Sippers, Frames or Tees), please share your high-res photos on WhatsApp with your Order ID <strong>#{order.orderId}</strong> for priority printing.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <a
                href={`https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works%2C%20here%20is%20my%20order%20%23${order.orderId}%20and%20photos%20for%20printing`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs font-mono"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Send Photos on WhatsApp (7888162822)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/917888162824?text=Hello%20Pro.%20Shaikh%20Sameer%2C%20my%20order%20is%20%23${order.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs font-mono font-bold"
              >
                <Phone className="w-3.5 h-3.5 fill-stone-950" />
                <span>Shaikh Sameer: 7888162824</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('account')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Track in My Orders
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Live Production Progress Timeline */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-700" />
              <h3 className="font-display font-bold text-base text-stone-900">
                Live Studio Production Status
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
              In Production
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-start relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                    step.current
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
                      : step.done
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-stone-900">{step.label}</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Purchased Items List */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-stone-900 pb-2 border-b border-stone-100">
              Manufactured Garments ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <div className="w-16 h-20 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-2xs">
                    <TShirtBaseSvg
                      color={item.colorHex}
                      view="front"
                      garmentType={item.garmentType}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Size: {item.size} · Color: {item.colorName} · Qty: {item.quantity}
                      </p>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        {item.printLocations.join(' + ')}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                      ₹{item.totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Billing Summary */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-stone-900 pb-2 border-b border-stone-100">
              Delivery & Billing
            </h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-stone-800">Shipping Address</h5>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-100">
                <CreditCard className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-stone-800">Payment Authorization</h5>
                  <p>{order.paymentMethod}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Paid in full</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{order.subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(0)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-100">
                  <span>Grand Total</span>
                  <span className="font-mono">₹{order.totalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

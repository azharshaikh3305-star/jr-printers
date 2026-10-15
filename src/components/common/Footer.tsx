import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Check, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setActiveCategory, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Subscribed! Check your inbox for 10% off your first custom order.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Upper Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-stone-800 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-500 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Museum-Grade DTG</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              1200 DPI archival textile pigments cured with industrial infrared heat presses.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-500 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Rapid Global Fulfillment</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Custom single-piece and bulk print runs dispatched within 48 business hours.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-500 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Print Perfection Guarantee</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every graphic is hand-proofed by apparel specialists before striking fabric.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-500 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-1">Complimentary Exchanges</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              30-day effortless size adjustments on all non-customized blank apparel.
            </p>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Direct Contact Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-black text-xl flex items-center justify-center font-display shadow-md shrink-0">
              JR
            </div>
            <div>
              <span className="text-xl font-display font-black text-white tracking-tight uppercase">
                JR PRINTING WORKS
              </span>
              <p className="text-xs text-amber-400 font-semibold">Pro. Shaikh Sameer</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-stone-400 max-w-sm leading-relaxed">
            Your specialized printing studio for T-Shirt Printing, Ceramic & Magic Cup Printing, Velvet & Sequin Pillow Printing, Bottle Printing, Key Chain Printing, Photo Frames, and Mobile Back Covers.
          </p>

          <div className="mt-5 space-y-2 text-xs">
            <a
              href="https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-mono font-bold"
            >
              <span>WhatsApp 1: +91 7888162822</span>
            </a>
            <a
              href="https://wa.me/917888162824?text=Hello%20Pro.%20Shaikh%20Sameer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-300 hover:text-amber-200 font-mono font-bold"
            >
              <span>Shaikh Sameer: +91 7888162824</span>
            </a>
          </div>
        </div>

        {/* Services & Shop Column */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Printing Services
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li>
              <button
                onClick={() => {
                  setActiveCategory('custom');
                  navigateTo('shop');
                }}
                className="hover:text-white transition-colors"
              >
                T-Shirt Printing
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveCategory('cups');
                  navigateTo('shop');
                }}
                className="hover:text-white transition-colors"
              >
                Cup & Magic Mugs
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveCategory('pillows');
                  navigateTo('shop');
                }}
                className="hover:text-white transition-colors"
              >
                Pillow & Cushions
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveCategory('bottles');
                  navigateTo('shop');
                }}
                className="hover:text-white transition-colors"
              >
                Bottle Printing
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveCategory('frames');
                  navigateTo('shop');
                }}
                className="hover:text-white transition-colors"
              >
                Photo Frame Printing
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveCategory('keychains');
                  navigateTo('shop');
                }}
                className="hover:text-white transition-colors"
              >
                Key Chains & Phone Covers
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('designer')}
                className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                Custom Design Studio <ArrowRight className="w-3 h-3" />
              </button>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                Our Story & Philosophy
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                Direct-to-Garment Tech
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                Ethical Organic Sourcing
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                Studio Contact & FAQ
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                Wholesale & Brand Collabs
              </button>
            </li>
          </ul>
        </div>

        {/* Account & Policies Column */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Account & Care</h4>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li>
              <button onClick={() => navigateTo('account')} className="hover:text-white transition-colors">
                Track My Order
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('account')} className="hover:text-white transition-colors">
                Saved Vector Designs
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('account')} className="hover:text-white transition-colors">
                Wishlist Archive
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                Garment Sizing Manual
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                Wash & Longevity Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('admin')}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 pt-1"
              >
                <span>Owner & Staff Portal</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Subtle Legal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div className="flex flex-col sm:flex-row items-center gap-x-3 gap-y-1">
          <span>© {new Date().getFullYear()} JR PRINTING WORKS · Pro. Shaikh Sameer.</span>
          <span>Made with care by RAY PVT. LTD.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Sublimation & DTG Precision</span>
          <span>·</span>
          <span>WhatsApp Proofing (+91 7888162822)</span>
          <span>·</span>
          <span>Safe India Dispatch</span>
        </div>
      </div>
    </footer>
  );
};

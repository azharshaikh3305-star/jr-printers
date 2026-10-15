import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JR_INFO } from '../../data/products';
import {
  MessageSquare,
  X,
  Phone,
  Mail,
  Package,
  Headphones,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const FloatingContactWidget: React.FC = () => {
  const { navigateTo, currentPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Do not show widget on full-screen designer canvas or on contact page itself
  if (currentPage === 'designer' || currentPage === 'contact') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] max-w-xs sm:w-80 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#2B0411] text-white p-4 flex items-center justify-between border-b border-rose-900">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center font-display text-base">
                JR
              </div>
              <div>
                <h4 className="font-bold text-xs font-display text-amber-300">JR PRINTING WORKS</h4>
                <p className="text-[10px] text-stone-300 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Pro. Shaikh Sameer Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
              aria-label="Close support popover"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-2 text-xs">
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Send your photos on WhatsApp for custom Mugs, Magic Cups, Pillows, Bottles, Frames & T-Shirts!
            </p>

            {/* Action 1: WhatsApp 1 (7888162822) */}
            <a
              href={JR_INFO.whatsapp1Link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp: {JR_INFO.phone1}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Action 2: WhatsApp / Call Shaikh Sameer (7888162824) */}
            <a
              href={JR_INFO.whatsapp2Link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 fill-stone-950" />
                <span>Shaikh Sameer: {JR_INFO.phone2}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Action 3: Open Full Contact Desk */}
            <button
              onClick={() => {
                setIsOpen(false);
                navigateTo('contact');
              }}
              className="w-full p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 rounded-xl font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-700" />
                <span>Open Contact & Quote Form</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Services note */}
            <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-500 flex items-center justify-between">
              <span>T-Shirt · Cup · Pillow · Bottle · Frame</span>
              <span className="text-emerald-700 font-semibold">Fast Proofing</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (Circular JR Help Centre & WhatsApp FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center active:scale-90 border-2 border-white/90 ${
          isOpen
            ? 'bg-stone-900 text-white shadow-stone-900/50 rotate-90'
            : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-emerald-900/40 hover:scale-105'
        }`}
        aria-label="JR Help Centre & WhatsApp Support"
        title={isOpen ? 'Close Help Centre' : 'JR Help Centre & WhatsApp (7888162822)'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* WhatsApp Chat Icon with fill */}
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white drop-shadow-xs" />

            {/* JR Badge at Top-Left */}
            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-black text-[9px] font-display flex items-center justify-center border border-stone-900 shadow-sm">
              JR
            </span>

            {/* Active Live Pulse Indicator at Top-Right */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-300 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-2xs" />
          </div>
        )}
      </button>
    </div>
  );
};

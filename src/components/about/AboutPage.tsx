import React from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCT_IMAGES, JR_INFO } from '../../data/products';
import {
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Printer,
  Heart,
  Package,
  Layers,
  ExternalLink,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo, setActiveCategory } = useApp();

  const services = [
    {
      title: 'T-Shirt Printing',
      desc: '100% Ring-spun combed cotton custom printed with archival textile inks. Single piece custom designs or bulk order runs.',
      image: PRODUCT_IMAGES.blackHeavyweight,
      category: 'custom',
    },
    {
      title: 'Cup & Magic Mug Printing',
      desc: 'AAA Grade ceramic glossy coffee mugs and heat-activated color-changing Magic Mugs that reveal photos when warm.',
      image: PRODUCT_IMAGES.mugsCups,
      category: 'cups',
    },
    {
      title: 'Pillow & Cushion Printing',
      desc: 'Plush velvet square photo cushions and interactive reversible Magic Sequin swipe pillows with plump conjugate fiber filling.',
      image: PRODUCT_IMAGES.pillows,
      category: 'pillows',
    },
    {
      title: 'Sports Bottle Printing',
      desc: 'Food-grade BPA-free aluminum bottles with leakproof carabiner clips and 360° cylindrical photo sublimation.',
      image: PRODUCT_IMAGES.bottlesGifts,
      category: 'bottles',
    },
    {
      title: 'Photo Frame Printing',
      desc: 'Engineered MDF wood wall collages with precision 3D laser-cut couple names, romantic hearts, and acrylic protection.',
      image: PRODUCT_IMAGES.photoFrames,
      category: 'frames',
    },
    {
      title: 'Key Chain Printing',
      desc: 'Double-sided crystal clear optical cast acrylic and polished chrome metal photo keychains.',
      image: PRODUCT_IMAGES.bottlesGifts,
      category: 'keychains',
    },
    {
      title: 'Mobile Back Cover Printing',
      desc: 'High-definition edge-to-edge sublimation hard covers for all iPhone, Samsung, OnePlus, Vivo, Oppo & Xiaomi models.',
      image: PRODUCT_IMAGES.bottlesGifts,
      category: 'mobile-covers',
    },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Hero Showcase */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B0411] via-[#48081E] to-[#20020B] border border-rose-900/60 shadow-2xl text-white p-8 sm:p-12 mb-16 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              {/* Yellow JR Logo Monogram */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-400 text-stone-950 font-black text-4xl sm:text-5xl flex items-center justify-center font-display shadow-xl border-2 border-amber-300 shrink-0">
                JR
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/80 border border-rose-700/80 text-amber-300 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Official Printing Studio</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
                  JR PRINTING WORKS
                </h1>
                <p className="text-sm sm:text-lg font-bold text-amber-300 mt-2">
                  Pro. Shaikh Sameer
                </p>
                <p className="mt-3 text-xs sm:text-sm text-stone-200/90 max-w-xl leading-relaxed">
                  Your trusted studio for customized photo gifts, sublimation mugs, velvet pillows, sipper bottles, wooden collage frames, keychains, mobile covers, and designer t-shirts.
                </p>
              </div>
            </div>

            {/* Direct Helpline Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href={JR_INFO.whatsapp1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 font-mono"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp: {JR_INFO.phone1}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={JR_INFO.whatsapp2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 font-mono font-bold"
              >
                <Phone className="w-4 h-4 fill-stone-950" />
                <span>Shaikh Sameer: {JR_INFO.phone2}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 7 Services from the Banner */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Complete Service Portfolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-stone-900 mt-2">
              Everything Featured on Our Official Banner
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Crafted in-house using commercial sublimation heat presses, rotary laser engraving, and archival pigment printers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 mb-4 border border-stone-200/60">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveCategory(s.category);
                      navigateTo('shop');
                    }}
                    className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                  >
                    <span>View In Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works%2C%20I%20want%20to%20order%20${encodeURIComponent(s.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The 3-Step Effortless WhatsApp Ordering Flow */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 mb-20">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Direct & Friendly Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mt-2">
              How Ordering Works at JR PRINTING WORKS
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-3 leading-relaxed">
              No complicated design software required if you don't want it. You can order in seconds directly through WhatsApp with Pro. Shaikh Sameer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-950/70 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center font-display text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold font-display">Pick Any Item or Design</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Select your mug, pillow, bottle, keychain, frame, or t-shirt size & color from our catalog, or use our online vector studio.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950/70 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center font-display text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold font-display">Send Photo on WhatsApp</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Send your high-res photos or text to <strong>7888162822</strong> or <strong>7888162824</strong>. Pro. Shaikh Sameer will send a digital 3D preview.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950/70 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center font-display text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold font-display">Heat Curing & Safe Delivery</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Once approved, your item is heat-pressed, carefully packaged in shockproof safety thermocol, and dispatched with tracking.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-black text-2xl flex items-center justify-center font-display mx-auto mb-4">
            JR
          </div>
          <h3 className="text-2xl font-display font-bold text-stone-900">
            Ready to Create Your Custom Gift?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto">
            Contact Pro. Shaikh Sameer on WhatsApp or explore our entire printable collection today.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={JR_INFO.whatsapp1Link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp (7888162822)</span>
            </a>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              Explore Shop Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

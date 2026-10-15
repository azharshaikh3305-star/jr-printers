import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCT_IMAGES, SAMPLE_PRODUCTS, JR_INFO } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { QuickViewModal } from '../shop/QuickViewModal';
import { Product } from '../../types';
import {
  Palette,
  ArrowRight,
  Sparkles,
  Layers,
  Eye,
  CheckCircle,
  Truck,
  Shield,
  Headphones,
  Shirt,
  Star,
  Quote,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, setActiveCategory } = useApp();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Categories extracted directly from the user's JR PRINTING WORKS banner
  const categories = [
    {
      id: 'custom',
      name: 'T-Shirt Printing',
      tagline: 'Add your Design HERE',
      desc: 'Custom graphic round neck tees, oversized streetwear, and team polo prints.',
      image: PRODUCT_IMAGES.heroModel,
      badge: 'Popular',
    },
    {
      id: 'cups',
      name: 'Cup & Magic Mug Printing',
      tagline: 'Hot Water Color Reveal & Photo Collages',
      desc: 'Ceramic glossy photo mugs & color-changing heat-sensitive magic reveal mugs.',
      image: PRODUCT_IMAGES.mugsCups,
      badge: 'Bestseller',
    },
    {
      id: 'pillows',
      name: 'Pillow & Cushion Printing',
      tagline: 'Velvet & Magic Sequin Swipe Pillows',
      desc: 'Plush velvet cushions & interactive reversible sequins that reveal photos with a touch.',
      image: PRODUCT_IMAGES.pillows,
      badge: 'Gift Favorite',
    },
    {
      id: 'bottles',
      name: 'Bottle & Sipper Printing',
      tagline: 'Aluminum Sports Sippers with Photo',
      desc: '750ml food-grade leakproof aluminum bottles with 360° cylindrical photo printing.',
      image: PRODUCT_IMAGES.bottlesGifts,
      badge: 'Active & Gym',
    },
    {
      id: 'frames',
      name: 'Photo Frame Printing',
      tagline: 'Personalized Wooden Wall Collages',
      desc: 'Multi-opening photo frames with 3D laser-cut couple names ("Shivansh ❤ Shanaya" style).',
      image: PRODUCT_IMAGES.photoFrames,
      badge: 'Keepsake',
    },
    {
      id: 'keychains',
      name: 'Key Chain & Mobile Back Covers',
      tagline: 'Pocket Keepsakes & HD Phone Cases',
      desc: 'Double-sided acrylic/metal keychains and edge-to-edge glossy mobile back cases.',
      image: PRODUCT_IMAGES.bottlesGifts,
      badge: 'Fast Dispatch',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Product or Send Photo',
      desc: 'Select from custom T-shirts, mugs, pillows, bottles, keychains, frames, or phone covers.',
      icon: <Shirt className="w-5 h-5 text-amber-700" />,
    },
    {
      number: '02',
      title: 'WhatsApp or Online Studio',
      desc: 'Upload high-res photos or design directly in our 360° online vector canvas editor.',
      icon: <Palette className="w-5 h-5 text-amber-700" />,
    },
    {
      number: '03',
      title: 'Instant Proof & Verification',
      desc: 'Our print specialists verify resolution and send visual preview before final printing.',
      icon: <Eye className="w-5 h-5 text-amber-700" />,
    },
    {
      number: '04',
      title: 'Fast Dispatch & Delivery',
      desc: 'Dispatched safely in protective packaging via BlueDart courier across India.',
      icon: <CheckCircle className="w-5 h-5 text-amber-700" />,
    },
  ];

  const pillars = [
    {
      title: 'Full Gift Printing Spectrum',
      desc: 'Everything under one roof: T-shirts, ceramic mugs, magic pillows, bottles, key chains, and wall frames.',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
    },
    {
      title: 'Proprietor Personal Care',
      desc: 'Under the personal supervision of Pro. Shaikh Sameer to ensure zero misprints and vibrant long-lasting colors.',
      icon: <Shield className="w-6 h-6 text-amber-600" />,
    },
    {
      title: 'WhatsApp Direct Support',
      desc: 'Instant help and photo proofing on 7888162822 & 7888162824 with quick quotation for single or bulk orders.',
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: 'Industrial Sublimation & DTG',
      desc: 'High-temperature thermal curing ensures prints never peel, fade, or crack after repeated washing.',
      icon: <Layers className="w-6 h-6 text-amber-600" />,
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Corporate Gifting Client',
      avatar: 'RS',
      rating: 5,
      product: 'JR Magic Color Reveal Mug',
      text: 'Shaikh Sameer bhai provided exceptional service. The magic color changing mugs were a huge hit at our office party. Hot coffee turns the black mug white and reveals the photo so clearly!',
    },
    {
      name: 'Pooja Kulkarni',
      role: 'Family Photo Frame Order',
      avatar: 'PK',
      rating: 5,
      product: 'JR Wooden Wall Collage Frame',
      text: 'Ordered the Shivansh & Shanaya style wooden collage frame for my anniversary. The laser-cut wooden name and glossy photo prints looked even better than the mockup. WhatsApp updates were super fast!',
    },
    {
      name: 'Aman Deshmukh',
      role: 'Gym & Sports Group Lead',
      avatar: 'AD',
      rating: 5,
      product: 'JR Aluminum Sports Sipper Bottle',
      text: 'We got 40 personalized sipper bottles printed for our fitness academy with member names and logos. Clean finish, solid carabiner clips, and dispatched within 48 hours.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. DIGITAL RECREATION OF THE EXACT "JR PRINTING WORKS" BANNER */}
      <section className="bg-[#1C020A] py-4 sm:py-8 px-2 sm:px-6 lg:px-8 border-b border-rose-950">
        <div className="max-w-7xl mx-auto">
          {/* Main Panoramic Banner Container matching the uploaded image */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B0411] via-[#48081E] to-[#20020B] border-2 border-rose-900/60 shadow-2xl text-white p-6 sm:p-10 lg:p-12">
            {/* Background Aesthetic Waves */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600 blur-3xl" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500 blur-3xl" />
              <svg className="w-full h-full object-cover" viewBox="0 0 1000 300" fill="none">
                <path d="M0,150 C300,300 700,-50 1000,150 L1000,300 L0,300 Z" fill="rgba(225,29,72,0.15)" />
                <path d="M0,80 C400,240 600,0 1000,100" stroke="rgba(244,63,94,0.3)" strokeWidth="3" fill="none" />
                <path d="M0,180 C350,50 650,280 1000,120" stroke="rgba(251,191,36,0.2)" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Banner Main Center Section: JR Yellow Logo + PRINTING WORKS */}
            <div className="relative z-10 py-6 lg:py-10 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 text-center md:text-left">
              {/* Huge Iconic Yellow "JR" Monogram (Faithful to the banner) */}
              <div className="shrink-0 select-none">
                <div className="relative">
                  <span className="text-7xl sm:text-9xl lg:text-[130px] font-display font-black text-[#FACC15] tracking-tighter leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] scale-110 inline-block">
                    JR
                  </span>
                  <span className="absolute -bottom-2 right-0 text-[10px] sm:text-xs font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                    Studio
                  </span>
                </div>
              </div>

              {/* Right Side: PRINTING WORKS & Complete List of Services */}
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight uppercase text-white leading-none drop-shadow-md">
                  PRINTING WORKS
                </h1>

                {/* Exact Services List from Banner */}
                <p className="mt-4 text-base sm:text-xl lg:text-2xl font-bold text-amber-200/95 leading-snug drop-shadow-xs">
                  T Shirt Printing, Cup Printing, Pillow Printing, <br className="hidden sm:inline" />
                  Bottle Printing, Key Chain Printing, Photo Frame Printing
                </p>

                {/* Badges of all items */}
                <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold">
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    👕 T-Shirt Printing
                  </span>
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    ☕ Cup Printing
                  </span>
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    🛋️ Pillow Printing
                  </span>
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    🍾 Bottle Printing
                  </span>
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    🔑 Key Chain
                  </span>
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    🖼️ Photo Frame
                  </span>
                  <span className="bg-black/50 border border-rose-700/60 text-white px-3 py-1 rounded-lg">
                    📱 Mobile Covers
                  </span>
                </div>
              </div>
            </div>

            {/* Banner Live Products Ribbon (Photos corresponding to banner illustration) */}
            <div className="relative z-10 pt-6 border-t border-rose-900/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Product 1: Sipper Bottle */}
              <div
                onClick={() => {
                  setActiveCategory('bottles');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.bottlesGifts}
                    alt="Bottle Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  Bottle Printing
                </span>
                <span className="text-[10px] text-amber-400 font-mono">From ₹449</span>
              </div>

              {/* Product 2: Cup Printing */}
              <div
                onClick={() => {
                  setActiveCategory('cups');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.mugsCups}
                    alt="Cup & Magic Mug Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  Cup & Magic Mug
                </span>
                <span className="text-[10px] text-amber-400 font-mono">From ₹249</span>
              </div>

              {/* Product 3: Pillow Printing */}
              <div
                onClick={() => {
                  setActiveCategory('pillows');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.pillows}
                    alt="Pillow & Sequin Cushion Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  Pillow & Sequin
                </span>
                <span className="text-[10px] text-amber-400 font-mono">From ₹499</span>
              </div>

              {/* Product 4: Photo Frame Printing */}
              <div
                onClick={() => {
                  setActiveCategory('frames');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.photoFrames}
                    alt="Photo Frame Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  Photo Frame
                </span>
                <span className="text-[10px] text-amber-400 font-mono">From ₹749</span>
              </div>

              {/* Product 5: Key Chain Printing */}
              <div
                onClick={() => {
                  setActiveCategory('keychains');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.bottlesGifts}
                    alt="Key Chain Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  Key Chains
                </span>
                <span className="text-[10px] text-amber-400 font-mono">From ₹149</span>
              </div>

              {/* Product 6: Mobile Back Cover */}
              <div
                onClick={() => {
                  setActiveCategory('mobile-covers');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.bottlesGifts}
                    alt="Mobile Back Cover Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  Mobile Covers
                </span>
                <span className="text-[10px] text-amber-400 font-mono">From ₹299</span>
              </div>

              {/* Product 7: T-Shirt Printing */}
              <div
                onClick={() => {
                  setActiveCategory('custom');
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-black/40 hover:bg-black/70 p-2.5 rounded-2xl border border-rose-900/40 hover:border-amber-400/80 transition-all flex flex-col items-center text-center col-span-2 sm:col-span-1"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 mb-2">
                  <img
                    src={PRODUCT_IMAGES.blackHeavyweight}
                    alt="T Shirt Printing"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300">
                  T-Shirt Printing
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Add Design</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={JR_INFO.whatsapp1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp Photos to 7888162822</span>
              </a>

              <a
                href={JR_INFO.whatsapp2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-stone-950" />
                <span>Call Shaikh Sameer: 7888162824</span>
              </a>

              <button
                onClick={() => navigateTo('designer')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-100 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4 text-amber-700" />
                <span>Custom T-Shirt 360° Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES: THE 6 SERVICES FROM THE BANNER */}
      <section className="py-16 sm:py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>JR Printing Works Catalog</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 mt-1">
                Personalized Printing Services
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                navigateTo('shop');
              }}
              className="mt-4 md:mt-0 text-xs sm:text-sm font-bold text-stone-800 hover:text-amber-800 transition-colors flex items-center gap-1.5"
            >
              <span>View All Items</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  navigateTo('shop');
                }}
                className="group cursor-pointer bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {cat.badge}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-amber-800 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">{cat.tagline}</p>
                    <p className="mt-2 text-xs text-stone-500 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-900">Custom Sublimation & Print</span>
                    <span className="text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Order Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE PRODUCTS HIGHLIGHT */}
      <section className="py-16 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Custom Printed Showcase
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 mt-1">
                Featured Personalized Items
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                navigateTo('shop');
              }}
              className="mt-4 md:mt-0 text-xs sm:text-sm font-bold text-stone-800 hover:text-amber-800 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Complete Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_PRODUCTS.slice(0, 8).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={() => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW ORDERING WORKS */}
      <section className="py-16 sm:py-20 bg-[#FAF9F5] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 mt-2">
              How To Get Your Custom Print
            </h2>
            <p className="mt-3 text-sm text-stone-600">
              From personal family gifts to bulk corporate merchandise, we make custom printing fast and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div
                key={st.number}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-display font-extrabold text-stone-300 font-mono">
                      {st.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                      {st.icon}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-base text-stone-900">{st.title}</h3>
                  <p className="mt-2 text-xs text-stone-500 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS OF TRUST */}
      <section className="py-16 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pil) => (
              <div key={pil.title} className="flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                  {pil.icon}
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 mb-1.5">{pil.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{pil.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-[#FAF9F5] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 mt-2">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">"{t.text}"</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#350614] text-amber-400 font-bold text-xs flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                    <p className="text-[10px] text-stone-500">{t.role}</p>
                    <span className="text-[10px] text-amber-800 font-medium">Item: {t.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDIO SUPPORT & CONTACT SHOWCASE SECTION */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200/80 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-800 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>JR PRINTING WORKS · Pro. Shaikh Sameer</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 mt-2">
                Need Help Ordering Custom Mugs, Pillows, or T-Shirts?
              </h2>
              <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                Connect directly with Pro. Shaikh Sameer on WhatsApp. Send your photos, artwork, or order inquiries, and receive immediate proofing and transparent pricing.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700">
                <a
                  href={JR_INFO.whatsapp1Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-400 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp 1: <strong className="font-mono text-stone-900">{JR_INFO.phone1}</strong></span>
                </a>
                <a
                  href={JR_INFO.whatsapp2Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 hover:border-amber-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Shaikh Sameer: <strong className="font-mono text-stone-900">{JR_INFO.phone2}</strong></span>
                </a>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                  <Mail className="w-3.5 h-3.5 text-stone-600" />
                  <span>support@jrprintingworks.in</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={JR_INFO.whatsapp1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp: 7888162822</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => navigateTo('contact')}
                className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-center"
              >
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>Open Contact & Order Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#1C020A] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            JR PRINTING WORKS
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-3 tracking-tight">
            Ready to Print Your Photos on Mugs, Pillows & T-Shirts?
          </h2>
          <p className="mt-4 text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Fast turnarounds, crystal-clear sublimation quality, and direct customer care with Pro. Shaikh Sameer.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={JR_INFO.whatsapp1Link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl text-xs flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Us: 7888162822</span>
            </a>
            <button
              onClick={() => navigateTo('designer')}
              className="bg-[#FACC15] hover:bg-amber-400 text-stone-950 font-bold px-8 py-4 rounded-xl transition-all shadow-xl text-xs flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span>Open Custom Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => {
                setActiveCategory('all');
                navigateTo('shop');
              }}
              className="text-stone-300 hover:text-white px-6 py-4 rounded-xl text-xs font-semibold border border-stone-800 transition-colors"
            >
              Explore All Items
            </button>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

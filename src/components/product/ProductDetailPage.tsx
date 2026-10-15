import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PRODUCTS, SIZE_CHART_DATA, JR_INFO } from '../../data/products';
import { TShirtBaseSvg } from '../common/TShirtBaseSvg';
import { ProductCard } from '../shop/ProductCard';
import { SizeGuideModal } from '../common/SizeGuideModal';
import {
  Star,
  ShoppingBag,
  Palette,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Ruler,
  ZoomIn,
  ChevronRight,
  Info,
  MessageSquare,
  Phone,
  ExternalLink,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    addToCart,
    startCustomizingProduct,
    wishlist,
    toggleWishlist,
    navigateTo,
    addToast,
  } = useApp();

  const product = selectedProduct || SAMPLE_PRODUCTS[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'materials' | 'sizing' | 'shipping' | 'returns'>('desc');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVectorMockup, setShowVectorMockup] = useState(false);
  const [mockupView, setMockupView] = useState<'front' | 'back'>('front');
  const [isZoomed, setIsZoomed] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${product.id}-${selectedColor.name}-${selectedSize}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      garmentType: product.garmentType,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
      quantity,
      unitPrice: product.basePrice,
      totalPrice: product.basePrice * quantity,
      printLocations: ['Standard Plain Blank'],
    });
  };

  const handleStartCustomizing = () => {
    startCustomizingProduct(product, selectedColor.hex);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?product=${product.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${product.name} (₹${product.basePrice}) · JR PRINTING WORKS`,
          text: `Check out ${product.name} at JR PRINTING WORKS! Custom HD printing available.`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      addToast('Product link copied! Share it on WhatsApp or Social Media.', 'success');
    }
  };

  const relatedProducts = SAMPLE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-stone-900 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button onClick={() => navigateTo('shop')} className="hover:text-stone-900 transition-colors">
            Shop Catalog
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 truncate">{product.name}</span>
        </nav>

        {/* Main PDP Grid: Left Gallery + Right Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery & Mockup Switcher */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage */}
            <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs flex items-center justify-center">
              {!showVectorMockup ? (
                <div
                  className={`w-full h-full cursor-zoom-in relative ${
                    isZoomed ? 'scale-150 transition-transform duration-300' : ''
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={product.images[activeImageIdx] || product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-stone-700 shadow-sm pointer-events-none">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                /* Dynamic Vector Garment Preview in exact selected color */
                <div className="w-full h-full p-8 flex items-center justify-center">
                  <div className="w-72 h-80 sm:w-96 sm:h-96">
                    <TShirtBaseSvg
                      color={selectedColor.hex}
                      shadowColor={selectedColor.shadowHex}
                      view={mockupView}
                      garmentType={product.garmentType}
                      showPrintAreaGuide={true}
                    />
                  </div>
                </div>
              )}

              {/* View Switchers: Photography vs Color Vector Mockup */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-stone-200 shadow-xs text-xs font-semibold">
                <button
                  onClick={() => setShowVectorMockup(false)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    !showVectorMockup
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Studio Photo
                </button>
                <button
                  onClick={() => setShowVectorMockup(true)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    showVectorMockup
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>Color Mockup</span>
                </button>
              </div>

              {/* Front / Back Toggle for Vector Mockup */}
              {showVectorMockup && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-stone-200 shadow-xs text-xs font-medium">
                  <button
                    onClick={() => setMockupView('front')}
                    className={`px-2.5 py-1 rounded-md ${
                      mockupView === 'front' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setMockupView('back')}
                    className={`px-2.5 py-1 rounded-md ${
                      mockupView === 'back' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowVectorMockup(false);
                    setActiveImageIdx(i);
                  }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    !showVectorMockup && activeImageIdx === i
                      ? 'border-stone-900 shadow-sm'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Color Mockup Quick Thumbnail */}
              <button
                onClick={() => setShowVectorMockup(true)}
                className={`w-20 h-20 rounded-xl border-2 shrink-0 flex flex-col items-center justify-center gap-1 transition-all ${
                  showVectorMockup
                    ? 'border-stone-900 bg-white shadow-sm'
                    : 'border-dashed border-stone-300 bg-stone-50 hover:bg-white'
                }`}
              >
                <Palette className="w-5 h-5 text-amber-700" />
                <span className="text-[10px] font-semibold text-stone-700">360° Color</span>
              </button>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              {/* Product Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                  {product.material}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    aria-label="Share Product"
                    title="Share on WhatsApp & Social Media"
                    className="p-2.5 rounded-full border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className={`p-2.5 rounded-full border transition-all ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 mt-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-xs font-bold text-stone-900">{product.rating}</span>
                </div>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 font-medium">{product.reviewCount} customer reviews</span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-emerald-700 font-medium">In Stock</span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-display font-extrabold text-stone-900 font-mono tabular-nums">
                  ₹{product.basePrice}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold text-stone-900">
                    Selected Color: <span className="font-normal text-stone-600">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        selectedColor.name === c.name
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-110 shadow-xs'
                          : 'border-stone-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold text-stone-900">
                    Select Size: <strong className="font-bold text-amber-800">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-amber-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide & Fit Chart</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === s
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold font-mono tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col gap-3">
              {/* Primary Customizer CTA */}
              <button
                onClick={handleStartCustomizing}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4" />
                <span>Customize in Studio (Add Graphics & Text)</span>
              </button>

              {/* Secondary Add Blank */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Blank (₹{product.basePrice * quantity})</span>
                </button>

                <button
                  onClick={() => {
                    handleAddToCart();
                    navigateTo('checkout');
                  }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Instant Checkout</span>
                </button>
              </div>

              {/* Delivery Assurance */}
              <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-3 text-xs text-stone-600">
                <Truck className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-800">Estimated Delivery: </span>
                  <span>Order within 14 hrs for delivery in 3–5 days. Protective thermocol packing.</span>
                </div>
              </div>

              {/* JR PRINTING WORKS Banner Guarantee Box */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#2B0411] to-[#3B0718] border border-rose-900/60 text-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center font-display">
                      JR
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-amber-300">JR PRINTING WORKS</h5>
                      <span className="text-[10px] text-stone-300">Pro. Shaikh Sameer</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-900/80 text-amber-300 px-2 py-0.5 rounded-full border border-rose-700/80 font-semibold">
                    Direct Printing
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Want your photo, collage, or custom name printed on this item? Message Pro. Shaikh Sameer directly on WhatsApp for instant 3D proofing.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs font-mono"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp: {JR_INFO.phone1}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://wa.me/917888162824?text=Hello%20Pro.%20Shaikh%20Sameer%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs font-mono"
                    title="WhatsApp Shaikh Sameer: 7888162824"
                  >
                    <Phone className="w-3.5 h-3.5 fill-stone-950" />
                    <span className="hidden sm:inline font-bold">7888162824</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="mt-16 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          {/* Tab Navigation */}
          <div className="flex items-center gap-4 sm:gap-8 border-b border-stone-200 pb-4 overflow-x-auto text-xs sm:text-sm font-semibold text-stone-500">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === 'desc' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Description & Features
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === 'materials' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Materials & Care
            </button>
            <button
              onClick={() => setActiveTab('sizing')}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === 'sizing' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Sizing Chart
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === 'shipping' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Printing & Shipping
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === 'returns' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Returns Policy
            </button>
          </div>

          {/* Tab Contents */}
          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
                <p>{product.description}</p>
                <h4 className="font-bold text-stone-900 pt-2 font-display">Key Construction Highlights</h4>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
                <p>
                  <strong>Composition:</strong> {product.material} ({product.weightGsm} GSM). Sourced directly from certified ethical mills adhering to Global Organic Textile Standard (GOTS).
                </p>
                <p>
                  <strong>Garment Care:</strong> Machine wash cold with like colors inside-out to maximize graphic longevity. Tumble dry on low heat or hang dry in the shade. Do not iron directly over printed surfaces.
                </p>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-stone-800 text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 uppercase text-[11px]">
                      <th className="py-2.5 pr-4">Size</th>
                      <th className="py-2.5 px-4">Chest (Inches)</th>
                      <th className="py-2.5 px-4">Chest (cm)</th>
                      <th className="py-2.5 px-4">Body Length</th>
                      <th className="py-2.5 px-4">Shoulder Width</th>
                      <th className="py-2.5 px-4">Sleeve Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {SIZE_CHART_DATA.map((row) => (
                      <tr
                        key={row.size}
                        className={selectedSize === row.size ? 'bg-amber-50/80 font-bold' : ''}
                      >
                        <td className="py-2.5 pr-4 font-bold font-sans text-stone-900">
                          {row.size}
                        </td>
                        <td className="py-2.5 px-4">{row.chestInches}</td>
                        <td className="py-2.5 px-4 text-stone-500">{row.chestCm}</td>
                        <td className="py-2.5 px-4">{row.lengthInches}</td>
                        <td className="py-2.5 px-4">{row.shoulderInches}</td>
                        <td className="py-2.5 px-4">{row.sleeveInches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
                <p>
                  <strong>Custom Print Turnaround:</strong> Because every customized order is individually printed, proofed, and heat-cured, custom garments dispatch within 48 business hours.
                </p>
                <p>
                  <strong>Shipping Options:</strong> Standard shipping (3–5 business days, ₹99 or free over ₹1,499). Express 2-Day Air (₹249). Real-time tracking is emailed as soon as the courier scans the parcel.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
                <p>
                  <strong>Blank Apparel:</strong> Unprinted blanks can be exchanged or returned within 30 days of receipt in original, unworn condition.
                </p>
                <p>
                  <strong>Custom Printed Garments:</strong> Since custom printed items are bespoke creations tailored exclusively to your artwork, we cannot accept returns for buyer's remorse. However, if there is any manufacturing flaw, textile defect, or print misregistration, we will reprint and reship your piece immediately free of charge.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
              You May Also Appreciate
            </h2>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-semibold text-stone-700 hover:text-amber-800 transition-colors"
            >
              Browse Full Archive →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Sizing Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        garmentName={product.name}
      />
    </div>
  );
};
